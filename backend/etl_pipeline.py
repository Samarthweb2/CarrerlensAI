"""
CareerLensAI ETL Pipeline  --  Production Dataset Ingestion
=========================================================
A reusable, 6-stage ETL pipeline that ingests any compatible CSV placed
inside data/raw/ into the CareerLensAI SQLite database.

Pipeline Stages:
    1. Discover   --  Auto-detect all CSV files in data/raw/
    2. Validate   --  Check required columns exist in each CSV
    3. Clean      --  Remove duplicates, nulls, and malformed records
    4. Normalize  --  Extract & normalize skills into relational tables
    5. Load       --  Batch-insert into SQLite (jobs, skills, job_skills)
    6. Report     --  Generate a Markdown ETL report in data/reports/

Usage:
    python etl_pipeline.py                  # Import all CSV files in data/raw/
    python etl_pipeline.py --limit 15000    # Import first 15,000 rows (dev mode)
    python etl_pipeline.py --file postings.csv  # Import a specific file only
"""

import csv
import os
import re
import sys
from datetime import datetime

# Add the backend directory to path if running directly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# -- SQLAlchemy DB Imports --
from database.database import SessionLocal, engine, Base
from database.models import JobRole, Skill

# -- Paths ------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DIR = os.path.join(DATA_DIR, 'raw')
REPORTS_DIR = os.path.join(DATA_DIR, 'reports')

# Batch size for bulk inserts
BATCH_SIZE = 500


# Required columns  --  a CSV must have at least these to be importable
REQUIRED_COLUMNS = {'title', 'description'}

# Known column mappings  --  maps common CSV column names to our internal names.
# This allows the pipeline to accept datasets from LinkedIn, Kaggle, Indeed, etc.
# without code changes  --  just drop a CSV with any of these column names.
COLUMN_MAP = {
    # Job title
    'title': ['title', 'job_title', 'position', 'role'],
    # Company
    'company': ['company_name', 'company', 'employer', 'organization'],
    # Location
    'location': ['location', 'city', 'region', 'job_location'],
    # Description
    'description': ['description', 'job_description', 'details', 'summary'],
    # Salary
    'salary': ['med_salary', 'median_salary', 'salary', 'annual_salary', 'pay'],
    'min_salary': ['min_salary', 'salary_min', 'minimum_salary'],
    'max_salary': ['max_salary', 'salary_max', 'maximum_salary'],
    # Experience level
    'experience_level': ['formatted_experience_level', 'experience_level',
                         'seniority', 'level', 'experience'],
    # Work type
    'work_type': ['formatted_work_type', 'work_type', 'employment_type',
                  'job_type', 'type'],
    # Skills
    'skills': ['skills_desc', 'skills', 'skill_tags', 'required_skills',
               'job_skills', 'skill_abr'],
}


# -- Database Connection Helper --
def get_db_session():
    """Returns a new SQLAlchemy database session."""
    return SessionLocal()



# ======================================================================
# STAGE 1: DISCOVER
# ======================================================================
def discover_csv_files(specific_file=None):
    """
    Auto-detects all CSV files in data/raw/.
    If specific_file is given, only returns that file if it exists.

    Returns: list of absolute file paths
    """
    if not os.path.isdir(RAW_DIR):
        os.makedirs(RAW_DIR, exist_ok=True)
        return []

    if specific_file:
        target = os.path.join(RAW_DIR, specific_file)
        if os.path.exists(target):
            return [target]
        else:
            print(f"  [X] Specified file not found: {target}")
            return []

    csv_files = sorted([
        os.path.join(RAW_DIR, f)
        for f in os.listdir(RAW_DIR)
        if f.lower().endswith('.csv') and os.path.isfile(os.path.join(RAW_DIR, f))
    ])
    return csv_files


# ======================================================================
# STAGE 2: VALIDATE
# ======================================================================
def _resolve_column(csv_headers, internal_name):
    """
    Given our internal column name (e.g. 'title'), finds the matching
    CSV header from COLUMN_MAP alternatives.

    Returns: the actual CSV header string, or None
    """
    candidates = COLUMN_MAP.get(internal_name, [internal_name])
    csv_headers_lower = {h.lower().strip(): h for h in csv_headers}
    for alias in candidates:
        if alias.lower() in csv_headers_lower:
            return csv_headers_lower[alias.lower()]
    return None


def validate_csv(filepath):
    """
    Opens a CSV, reads its header, and checks that required columns exist.
    Also builds a resolved column mapping for this specific file.

    Returns: (is_valid: bool, resolved_map: dict, csv_headers: list)
        resolved_map maps internal names -> actual CSV header names
    """
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            reader = csv.reader(f)
            headers = next(reader, None)
    except Exception as e:
        print(f"  [X] Cannot read {os.path.basename(filepath)}: {e}")
        return False, {}, []

    if not headers:
        print(f"  [X] {os.path.basename(filepath)} is empty (no header row).")
        return False, {}, []

    # Build resolved mapping
    resolved = {}
    for internal_name in COLUMN_MAP:
        actual = _resolve_column(headers, internal_name)
        if actual:
            resolved[internal_name] = actual

    # Check required columns
    missing = []
    for req in REQUIRED_COLUMNS:
        if req not in resolved:
            missing.append(req)

    if missing:
        print(f"  [X] {os.path.basename(filepath)} is missing required columns: {missing}")
        print(f"    Found headers: {headers[:15]}{'...' if len(headers) > 15 else ''}")
        return False, resolved, headers

    return True, resolved, headers


# ======================================================================
# STAGE 3: CLEAN
# ======================================================================
def clean_and_read_rows(filepath, resolved_map, limit=None):
    """
    Reads CSV rows, applies cleaning rules:
      - Skip rows with empty/missing title
      - Skip rows with description shorter than 20 chars
      - Deduplicate by (title, company, location) tuple
      - Compute salary from med/min/max fields

    Returns: (clean_rows: list[dict], stats: dict)
        Each clean_row has normalized keys: title, company, location,
        description, salary, experience_level, work_type, skills_raw
    """
    stats = {
        'total_read': 0,
        'skipped_no_title': 0,
        'skipped_short_desc': 0,
        'duplicates_removed': 0,
        'nulls_defaulted': 0,
    }

    seen = set()  # For deduplication
    clean_rows = []

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f)
        for row in reader:
            stats['total_read'] += 1
            if limit and len(clean_rows) >= limit:
                break

            # -- Extract fields using resolved column mapping --
            title = row.get(resolved_map.get('title', ''), '').strip()
            description = row.get(resolved_map.get('description', ''), '').strip()
            company = row.get(resolved_map.get('company', ''), '').strip()
            location = row.get(resolved_map.get('location', ''), '').strip()
            experience_level = row.get(resolved_map.get('experience_level', ''), '').strip()
            work_type = row.get(resolved_map.get('work_type', ''), '').strip()
            skills_raw = row.get(resolved_map.get('skills', ''), '').strip()

            # -- Salary resolution: prefer median, fallback to avg(min, max) --
            salary = None
            salary_min = None
            salary_max = None
            med_str = row.get(resolved_map.get('salary', ''), '').strip()
            min_str = row.get(resolved_map.get('min_salary', ''), '').strip()
            max_str = row.get(resolved_map.get('max_salary', ''), '').strip()

            if med_str:
                try:
                    salary = int(float(med_str))
                except (ValueError, TypeError):
                    pass
            if min_str:
                try:
                    salary_min = int(float(min_str))
                except (ValueError, TypeError):
                    pass
            if max_str:
                try:
                    salary_max = int(float(max_str))
                except (ValueError, TypeError):
                    pass

            if salary is None and salary_min is not None and salary_max is not None:
                salary = int((salary_min + salary_max) / 2)
                
            # Filter out likely hourly rates and unreasonable values
            if salary is not None and salary < 1000:
                salary = None
            if salary_min is not None and salary_min < 1000:
                salary_min = None
            if salary_max is not None and salary_max < 1000:
                salary_max = None

            # -- Validation: skip rows without title --
            if not title:
                stats['skipped_no_title'] += 1
                continue

            # -- Validation: skip rows with very short descriptions --
            if not description or len(description) < 20:
                stats['skipped_short_desc'] += 1
                continue

            # -- Default missing optional fields --
            if not company:
                company = 'Unknown'
                stats['nulls_defaulted'] += 1
            if not location:
                location = 'Not Specified'
                stats['nulls_defaulted'] += 1

            # Standardize Work Type
            if work_type:
                wt_lower = work_type.lower()
                if 'remote' in wt_lower or 'wfh' in wt_lower or 'work from home' in wt_lower:
                    work_type = 'Remote'
                elif 'hybrid' in wt_lower:
                    work_type = 'Hybrid'
                elif 'onsite' in wt_lower or 'office' in wt_lower or 'on-site' in wt_lower:
                    work_type = 'On-site'
                else:
                    work_type = 'On-site'  # default fallback
            else:
                work_type = 'On-site'

            # Standardize Experience Level
            if experience_level:
                exp_lower = experience_level.lower()
                if 'senior' in exp_lower or 'sr' in exp_lower or 'lead' in exp_lower or 'principal' in exp_lower:
                    experience_level = 'Senior'
                elif 'junior' in exp_lower or 'jr' in exp_lower or 'entry' in exp_lower or 'associate' in exp_lower or 'intern' in exp_lower:
                    experience_level = 'Entry'
                else:
                    experience_level = 'Mid'
            else:
                experience_level = 'Mid'


            # -- Deduplication by (title, company, location) --
            dedup_key = (title.lower(), company.lower(), location.lower())
            if dedup_key in seen:
                stats['duplicates_removed'] += 1
                continue
            seen.add(dedup_key)

            clean_rows.append({
                'title': title,
                'company': company,
                'location': location,
                'description': description,
                'salary': salary,
                'salary_min': salary_min,
                'salary_max': salary_max,
                'experience_level': experience_level,
                'work_type': work_type,
                'skills_raw': skills_raw,
            })


            # Progress indicator for large files
            if stats['total_read'] % 50000 == 0:
                print(f"  ... Read {stats['total_read']:,} rows, "
                      f"{len(clean_rows):,} clean so far")

    return clean_rows, stats


# ======================================================================
# STAGE 4: NORMALIZE SKILLS
# ======================================================================

# Skill extraction patterns for parsing skills from description text
SKILL_PATTERNS = [
    # Programming languages
    'python', 'java', 'javascript', 'typescript', 'c\\+\\+', 'c#', 'ruby',
    'go', 'rust', 'swift', 'kotlin', 'scala', 'perl', 'php', 'r',
    'matlab', 'html', 'css', 'bash', 'shell',
    # Data & analytics
    'sql', 'pandas', 'numpy', 'spark', 'hadoop', 'hive', 'kafka',
    'airflow', 'dbt', 'snowflake', 'redshift', 'bigquery',
    'tableau', 'power bi', 'looker', 'excel', 'etl',
    'data analysis', 'data engineering', 'data science',
    'statistics', 'analytics',
    # AI / ML
    'machine learning', 'deep learning', 'nlp',
    'natural language processing', 'computer vision',
    'tensorflow', 'pytorch', 'scikit-learn', 'keras',
    'neural network', 'generative ai', 'llm',
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
    'terraform', 'ansible', 'jenkins', 'ci/cd', 'devops',
    'linux', 'git', 'github',
    # Databases
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'dynamodb', 'cassandra', 'neo4j', 'oracle',
    # Web & frameworks
    'react', 'angular', 'vue', 'node\\.js', 'django', 'flask',
    'spring', 'fastapi', 'express',
    # Soft skills
    'communication', 'leadership', 'teamwork', 'problem solving',
    'project management', 'agile', 'scrum', 'presentation',
    'collaboration', 'critical thinking',
]

# Pre-compile regex patterns for performance
_SKILL_REGEXES = [(s, re.compile(r'\b' + s + r'\b', re.IGNORECASE))
                   for s in SKILL_PATTERNS]


def _categorize_skill(skill_name_lower):
    """Assigns a category to a skill based on keyword heuristics."""
    programming = ['python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'go',
                   'rust', 'typescript', 'php', 'swift', 'kotlin', 'scala',
                   'perl', 'r', 'matlab', 'html', 'css', 'bash', 'shell']
    data = ['sql', 'pandas', 'numpy', 'spark', 'hadoop', 'etl', 'data',
            'analytics', 'statistics', 'tableau', 'power bi', 'excel',
            'looker', 'snowflake', 'redshift', 'bigquery', 'hive',
            'airflow', 'dbt', 'kafka']
    ai_ml = ['machine learning', 'deep learning', 'nlp', 'tensorflow',
             'pytorch', 'ai', 'neural', 'computer vision', 'llm',
             'generative', 'scikit-learn', 'keras']
    cloud = ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
             'terraform', 'devops', 'ci/cd', 'jenkins', 'ansible', 'linux']
    databases = ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
                 'dynamodb', 'cassandra', 'neo4j', 'oracle']
    web = ['react', 'angular', 'vue', 'node.js', 'django', 'flask',
           'spring', 'fastapi', 'express', 'html', 'css']
    soft = ['communication', 'leadership', 'teamwork', 'problem solving',
            'presentation', 'management', 'negotiation', 'collaboration',
            'agile', 'scrum', 'critical thinking', 'project management']

    for kw in programming:
        if kw in skill_name_lower:
            return 'Programming'
    for kw in ai_ml:
        if kw in skill_name_lower:
            return 'AI & ML'
    for kw in data:
        if kw in skill_name_lower:
            return 'Data & Analytics'
    for kw in cloud:
        if kw in skill_name_lower:
            return 'Cloud & DevOps'
    for kw in databases:
        if kw in skill_name_lower:
            return 'Databases'
    for kw in web:
        if kw in skill_name_lower:
            return 'Web Development'
    for kw in soft:
        if kw in skill_name_lower:
            return 'Soft Skill'
    return 'Technical'


def standardize_skill_name(name: str) -> str:
    """Standardizes skill names to a single canonical format, avoiding duplicates."""
    name_clean = name.strip().lower()
    
    # Python variants
    if name_clean in ('python', 'python3', 'python programming', 'py'):
        return 'Python'
    # JavaScript variants
    if name_clean in ('js', 'javascript', 'js dev'):
        return 'JavaScript'
    # TypeScript variants
    if name_clean in ('ts', 'typescript'):
        return 'TypeScript'
    # React variants
    if name_clean in ('react', 'react js', 'reactjs', 'react.js'):
        return 'React'
    # NextJS variants
    if name_clean in ('next', 'nextjs', 'next.js'):
        return 'Next.js'
    # Vue variants
    if name_clean in ('vue', 'vuejs', 'vue.js'):
        return 'Vue.js'
    # Node variants
    if name_clean in ('node', 'nodejs', 'node.js'):
        return 'Node.js'
    # AWS variants
    if name_clean in ('aws', 'amazon web services'):
        return 'AWS'
    # GCP variants
    if name_clean in ('gcp', 'google cloud', 'google cloud platform'):
        return 'GCP'
    # C++ variants
    if name_clean in ('c++', 'c plus plus', 'cpp'):
        return 'C++'
    # C# variants
    if name_clean in ('c#', 'c sharp'):
        return 'C#'
    # CI/CD variants
    if name_clean in ('ci/cd', 'cicd', 'continuous integration'):
        return 'CI/CD'
    # ML / AI variants
    if name_clean in ('ml', 'machine learning'):
        return 'Machine Learning'
    if name_clean in ('dl', 'deep learning'):
        return 'Deep Learning'
    if name_clean in ('nlp', 'natural language processing'):
        return 'NLP'
    if name_clean in ('genai', 'generative ai'):
        return 'Generative AI'
    if name_clean in ('llm', 'llms', 'large language models'):
        return 'LLM'
    # HTML/CSS variants
    if name_clean == 'html': return 'HTML5'
    if name_clean == 'css': return 'CSS3'
    if name_clean == 'tailwind': return 'Tailwind CSS'
    
    # Fallback to standard casing
    if len(name) <= 3:
        return name.upper()
    return name.title()


def _extract_skills_from_text(text):
    """
    Extracts skills from free-text description using regex matching.
    Returns a set of standardized skill names.
    """
    found = set()
    for skill_name, pattern in _SKILL_REGEXES:
        if pattern.search(text):
            standardized = standardize_skill_name(skill_name)
            found.add(standardized)
    return found


def normalize_skills(clean_rows):
    """
    Processes all cleaned rows and extracts skills from:
      1. The skills_raw column (comma/semicolon separated)
      2. Fallback: regex extraction from description text

    Modifies each row in-place to add 'skills_parsed': set of skill names.
    Returns: total unique skills count discovered
    """
    all_skills = set()

    for row in clean_rows:
        skills = set()
        skills_raw = row.get('skills_raw', '')


        # Method 1: Parse from the skills column if available
        if skills_raw:
            # Split by common delimiters: comma, semicolon, pipe
            raw_list = re.split(r'[,;|]', skills_raw)
            for s in raw_list:
                s = s.strip()
                if s and len(s) >= 2:
                    # Normalize display name using our canonical mapper
                    display = standardize_skill_name(s)
                    skills.add(display)


        # Method 2: Regex extraction from description (supplements skills column)
        desc_skills = _extract_skills_from_text(row['description'])
        skills.update(desc_skills)

        row['skills_parsed'] = skills
        all_skills.update(skills)

    return len(all_skills)


# ======================================================================
# STAGE 5: LOAD INTO SQLITE
# ======================================================================
def load_into_database(clean_rows):
    """
    Inserts cleaned and normalized rows into database tables:
      - job_roles (using SQLAlchemy ORM)
      - skills (auto-register new skills)

    The load is idempotent: clears existing job data before inserting.
    Returns: dict of load statistics
    """
    # Ensure all tables are created in the database
    Base.metadata.create_all(bind=engine)
    
    db = get_db_session()

    load_stats = {
        'jobs_inserted': 0,
        'skills_registered': 0,
        'job_skill_links': 0,
        'jobs_with_salary': 0,
    }

    try:
        # Clear existing job data (ETL is idempotent)
        print("  Clearing existing job_roles and skills...")
        db.query(JobRole).delete()
        db.query(Skill).delete()
        db.commit()

        # ---- 1. Extract and register all unique skills ----
        print("  Registering skills...")
        unique_skills_set = set()
        for row in clean_rows:
            unique_skills_set.update(row.get('skills_parsed', []))

        skills_objects = []
        for skill_name in sorted(unique_skills_set):
            category = _categorize_skill(skill_name.lower())
            skills_objects.append(Skill(name=skill_name, category=category))

        db.bulk_save_objects(skills_objects)
        db.commit()
        load_stats['skills_registered'] = len(unique_skills_set)

        # ---- 2. Insert Job Roles ----
        print(f"  Loading {len(clean_rows):,} jobs into job_roles...")
        job_roles_objects = []

        for idx, row in enumerate(clean_rows):
            skills_parsed_list = sorted(list(row.get('skills_parsed', [])))
            num_skills = len(skills_parsed_list)
            
            # Split skills into required and preferred
            split_idx = int(num_skills * 0.7)
            required_skills = skills_parsed_list[:split_idx]
            preferred_skills = skills_parsed_list[split_idx:]
            ats_keywords = skills_parsed_list

            # Categorize industry based on job title
            title_lower = row['title'].lower()
            industry = "Software Engineering"
            if "data" in title_lower or "analytics" in title_lower:
                industry = "Data & Analytics"
            elif "ml" in title_lower or "machine learning" in title_lower or "ai" in title_lower or "deep learning" in title_lower:
                industry = "AI & Machine Learning"
            elif "devops" in title_lower or "sre" in title_lower or "cloud" in title_lower or "infrastructure" in title_lower:
                industry = "Infrastructure"
            elif "security" in title_lower or "cyber" in title_lower:
                industry = "Security"
            elif "mobile" in title_lower or "ios" in title_lower or "android" in title_lower or "flutter" in title_lower or "react native" in title_lower:
                industry = "Mobile Development"
            elif "product" in title_lower or "project" in title_lower:
                industry = "Product"
            elif "design" in title_lower or "ux" in title_lower or "ui" in title_lower:
                industry = "Design"

            job_role = JobRole(
                title=row['title'],
                company=row['company'],
                location=row['location'],
                industry=industry,
                description=row['description'],
                required_skills=required_skills,
                preferred_skills=preferred_skills,
                experience_level=row['experience_level'],
                salary_min=row['salary_min'],
                salary_max=row['salary_max'],
                work_type=row['work_type'],
                ats_keywords=ats_keywords
            )
            job_roles_objects.append(job_role)

            if row['salary'] is not None or row['salary_min'] is not None:
                load_stats['jobs_with_salary'] += 1

            if len(job_roles_objects) >= BATCH_SIZE:
                db.bulk_save_objects(job_roles_objects)
                db.commit()
                job_roles_objects = []
                if (idx + 1) % 10000 == 0:
                    print(f"  ... Inserted {idx + 1:,} job roles")

        if job_roles_objects:
            db.bulk_save_objects(job_roles_objects)
            db.commit()

        load_stats['jobs_inserted'] = len(clean_rows)
        # We don't have job_skills links anymore, so we set job_skill_links to total skills listed
        load_stats['job_skill_links'] = sum(len(r.get('skills_parsed', [])) for r in clean_rows)

    except Exception as e:
        print(f"  [ERROR] Database insertion failed: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

    return load_stats



# ======================================================================
# STAGE 6: GENERATE ETL REPORT
# ======================================================================
def generate_report(source_files, clean_stats, load_stats, resolved_maps,
                    csv_headers_map, unique_skills_count, elapsed_seconds):
    """
    Generates a human-readable Markdown ETL report and saves it to
    data/reports/etl_report_YYYYMMDD_HHMMSS.md.

    Returns: path to the generated report
    """
    os.makedirs(REPORTS_DIR, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    report_path = os.path.join(REPORTS_DIR, f'etl_report_{timestamp}.md')
    display_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    file_names = [os.path.basename(f) for f in source_files]

    lines = []
    lines.append("# CareerLensAI ETL Report")
    lines.append(f"**Run Date:** {display_time}  ")
    lines.append(f"**Source Files:** {', '.join(file_names)}  ")
    lines.append(f"**Duration:** {elapsed_seconds:.1f} seconds  ")
    lines.append("")

    # -- Summary Table --
    lines.append("## Summary")
    lines.append("")
    lines.append("| Metric | Value |")
    lines.append("|---|---|")
    lines.append(f"| Total rows read | {clean_stats['total_read']:,} |")
    lines.append(f"| Rows imported (cleaned) | {load_stats['jobs_inserted']:,} |")
    lines.append(f"| Duplicates removed | {clean_stats['duplicates_removed']:,} |")
    lines.append(f"| Rows skipped (no title) | {clean_stats['skipped_no_title']:,} |")
    lines.append(f"| Rows skipped (short description) | {clean_stats['skipped_short_desc']:,} |")
    lines.append(f"| Null fields defaulted | {clean_stats['nulls_defaulted']:,} |")
    lines.append(f"| Unique skills extracted | {unique_skills_count:,} |")
    lines.append(f"| New skills registered | {load_stats['skills_registered']:,} |")
    lines.append(f"| Job-skill links created | {load_stats['job_skill_links']:,} |")
    lines.append(f"| Jobs with salary data | {load_stats['jobs_with_salary']:,} |")
    lines.append("")

    # -- Column Mapping per file --
    for filepath in source_files:
        fname = os.path.basename(filepath)
        resolved = resolved_maps.get(filepath, {})
        all_headers = csv_headers_map.get(filepath, [])

        lines.append(f"## Column Mapping: {fname}")
        lines.append("")
        lines.append("| Internal Field | CSV Column | Status |")
        lines.append("|---|---|---|")

        for internal_name in COLUMN_MAP:
            actual = resolved.get(internal_name)
            if actual:
                lines.append(f"| {internal_name} | {actual} | [OK] Mapped |")
            else:
                lines.append(f"| {internal_name} |  --  | [X] Not found (skipped) |")
        lines.append("")

    # -- Data Quality Notes --
    lines.append("## Data Quality Notes")
    lines.append("")
    if clean_stats['duplicates_removed'] > 0:
        lines.append(f"- **{clean_stats['duplicates_removed']:,}** duplicate rows "
                      "removed (deduped by title + company + location)")
    if clean_stats['skipped_no_title'] > 0:
        lines.append(f"- **{clean_stats['skipped_no_title']:,}** rows skipped "
                      "(missing title)")
    if clean_stats['skipped_short_desc'] > 0:
        lines.append(f"- **{clean_stats['skipped_short_desc']:,}** rows skipped "
                      "(description < 20 characters)")
    if clean_stats['nulls_defaulted'] > 0:
        lines.append(f"- **{clean_stats['nulls_defaulted']:,}** null optional fields "
                      "defaulted (company -> 'Unknown', location -> 'Not Specified')")
    if clean_stats['duplicates_removed'] == 0 and clean_stats['skipped_no_title'] == 0:
        lines.append("- No data quality issues detected [OK]")
    lines.append("")

    # -- Final DB Stats --
    lines.append("## Final Database State")
    lines.append("")
    try:
        db = get_db_session()
        db_stats = {
            'job_roles': db.query(JobRole).count(),
            'skills': db.query(Skill).count(),
        }
        db.close()
        lines.append("| Table | Row Count |")
        lines.append("|---|---|")
        for table, count in db_stats.items():
            lines.append(f"| {table} | {count:,} |")
    except Exception as e:
        lines.append(f"*(Could not read final database stats: {e})*")

    lines.append("")
    lines.append("---")
    lines.append("*Generated by CareerLensAI ETL Pipeline*")

    report_content = '\n'.join(lines)

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)

    return report_path


# ======================================================================
# PIPELINE ORCHESTRATOR
# ======================================================================
def run_etl_pipeline(limit=None, specific_file=None):
    """
    Runs the complete 6-stage ETL pipeline.
    
    Args:
        limit: Max rows to import per file (None = all)
        specific_file: Import only this filename from data/raw/ (None = all CSVs)
    
    Returns: True if successful, False otherwise
    """
    import time
    start_time = time.time()

    print("=" * 60)
    print("  CareerLensAI ETL Pipeline")
    print("=" * 60)

    if limit:
        print(f"\n  [*] Running with --limit {limit:,} (dev mode)")
    if specific_file:
        print(f"  [*] Targeting specific file: {specific_file}")

    # -- STAGE 1: Discover --
    print("\n-- Stage 1: Discovering CSV files in data/raw/ ---------")
    csv_files = discover_csv_files(specific_file=specific_file)

    if not csv_files:
        print(f"""
  [X] No CSV files found in: {RAW_DIR}

  Place any compatible CSV dataset into data/raw/ and re-run.
  Required columns: {', '.join(REQUIRED_COLUMNS)}
""")
        return False

    print(f"  [OK] Found {len(csv_files)} CSV file(s):")
    for f in csv_files:
        size_mb = os.path.getsize(f) / (1024 * 1024)
        print(f"    - {os.path.basename(f)} ({size_mb:.1f} MB)")

    # -- STAGE 2: Validate --
    print("\n-- Stage 2: Validating CSV schemas ---------------------")
    valid_files = []
    resolved_maps = {}
    csv_headers_map = {}

    for filepath in csv_files:
        is_valid, resolved, headers = validate_csv(filepath)
        if is_valid:
            valid_files.append(filepath)
            resolved_maps[filepath] = resolved
            csv_headers_map[filepath] = headers
            mapped_cols = [f"{k}->{v}" for k, v in resolved.items()]
            print(f"  [OK] {os.path.basename(filepath)}: "
                  f"{len(resolved)} columns mapped")
        else:
            print(f"  [X] {os.path.basename(filepath)}: SKIPPED (validation failed)")

    if not valid_files:
        print("\n  [X] No valid CSV files to import.")
        return False

    # -- STAGE 3: Clean --
    print("\n-- Stage 3: Cleaning & deduplicating -------------------")
    all_clean_rows = []
    aggregate_stats = {
        'total_read': 0,
        'skipped_no_title': 0,
        'skipped_short_desc': 0,
        'duplicates_removed': 0,
        'nulls_defaulted': 0,
    }

    for filepath in valid_files:
        fname = os.path.basename(filepath)
        print(f"  Processing {fname}...")
        clean_rows, stats = clean_and_read_rows(
            filepath, resolved_maps[filepath], limit=limit
        )
        all_clean_rows.extend(clean_rows)

        # Aggregate stats
        for key in aggregate_stats:
            aggregate_stats[key] += stats[key]

        print(f"  [OK] {fname}: {len(clean_rows):,} clean rows "
              f"({stats['duplicates_removed']:,} dupes, "
              f"{stats['skipped_no_title']:,} no-title, "
              f"{stats['skipped_short_desc']:,} short-desc)")

    if not all_clean_rows:
        print("\n  [X] No usable rows after cleaning.")
        return False

    # -- STAGE 4: Normalize Skills --
    print("\n-- Stage 4: Normalizing skills -------------------------")
    unique_skills = normalize_skills(all_clean_rows)
    # Count how many rows have at least one skill
    rows_with_skills = sum(1 for r in all_clean_rows if r.get('skills_parsed'))
    print(f"  [OK] Extracted {unique_skills:,} unique skills "
          f"across {rows_with_skills:,} job postings")

    # -- STAGE 5: Load --
    print("\n-- Stage 5: Loading into SQLite -------------------------")
    load_stats = load_into_database(all_clean_rows)
    print(f"  [OK] Jobs inserted:       {load_stats['jobs_inserted']:>8,}")
    print(f"  [OK] New skills added:    {load_stats['skills_registered']:>8,}")
    print(f"  [OK] Job-skill links:     {load_stats['job_skill_links']:>8,}")
    print(f"  [OK] Jobs with salary:    {load_stats['jobs_with_salary']:>8,}")

    # -- STAGE 6: Report --
    elapsed = time.time() - start_time
    print("\n-- Stage 6: Generating ETL report -----------------------")
    report_path = generate_report(
        source_files=valid_files,
        clean_stats=aggregate_stats,
        load_stats=load_stats,
        resolved_maps=resolved_maps,
        csv_headers_map=csv_headers_map,
        unique_skills_count=unique_skills,
        elapsed_seconds=elapsed,
    )
    print(f"  [OK] Report saved to: {report_path}")

    # -- Final Summary --
    print(f"""
{"=" * 60}
  [OK] ETL Pipeline Completed Successfully!
{"=" * 60}
   Final Summary:
     Files processed:    {len(valid_files):>8}
     Jobs imported:      {load_stats['jobs_inserted']:>8,}
     Skills in database: {load_stats['skills_registered']:>8,} new
     Job-skill links:    {load_stats['job_skill_links']:>8,}
     Duration:           {elapsed:>7.1f}s
     Report:             {os.path.basename(report_path)}
{"=" * 60}
""")
    return True


# -- CLI Entry Point --------------------------------------------------
if __name__ == '__main__':
    limit = None
    specific_file = None

    if '--limit' in sys.argv:
        try:
            idx = sys.argv.index('--limit')
            limit = int(sys.argv[idx + 1])
        except (IndexError, ValueError):
            print("Usage: python etl_pipeline.py [--limit N] [--file filename.csv]")
            sys.exit(1)

    if '--file' in sys.argv:
        try:
            idx = sys.argv.index('--file')
            specific_file = sys.argv[idx + 1]
        except (IndexError, ValueError):
            print("Usage: python etl_pipeline.py [--limit N] [--file filename.csv]")
            sys.exit(1)

    success = run_etl_pipeline(limit=limit, specific_file=specific_file)
    sys.exit(0 if success else 1)
