
"""
CareerLensAI Resume Analysis Service
=====================================
Accepts raw resume text (from resume_parser.py), extracts structured
information, and returns a normalized candidate profile dictionary.

This module is the single entry point between parsing and all downstream
services: Resume Score, Skill Gap, Job Matching, Learning Roadmap, and
Market Insights.

Usage:
    from services.resume_analysis_service import analyze_resume

    raw_text = extract_text_from_pdf("resume.pdf")
    profile  = analyze_resume(raw_text, filename="John_Doe_Resume.pdf")

    # profile is a clean dict ready for every downstream consumer.

Dependencies: None (no FastAPI, no Streamlit, no database imports).
"""

import re
import os
from datetime import datetime


# =====================================================================
# SECTION HEADING PATTERNS
# =====================================================================
# Maps canonical section names to regex patterns that match common
# resume headings.  Order matters: more specific patterns come first.

_SECTION_PATTERNS = {
    'education': re.compile(
        r'^(?:education|academic\s*background|qualifications|degrees?)'
        r'(?:\s*&\s*training)?',
        re.IGNORECASE,
    ),
    'experience': re.compile(
        r'^(?:(?:work|professional|employment|career)\s*(?:experience|history)s?'
        r'|experience|internships?)',
        re.IGNORECASE,
    ),
    'skills': re.compile(
        r'^(?:(?:technical|core|key|relevant|professional)?\s*skills'
        r'|technologies|tech\s*stack|tools|competenc(?:ies|e))',
        re.IGNORECASE,
    ),
    'projects': re.compile(
        r'^(?:(?:personal|academic|notable|key)?\s*projects?)',
        re.IGNORECASE,
    ),
    'certifications': re.compile(
        r'^(?:certifications?|licenses?|accreditations?'
        r'|courses?\s*(?:&\s*)?certifications?'
        r'|professional\s*development)',
        re.IGNORECASE,
    ),
    'summary': re.compile(
        r'^(?:(?:professional\s*)?summary|(?:career\s*)?objective'
        r'|profile|about\s*me|introduction)',
        re.IGNORECASE,
    ),
    'awards': re.compile(
        r'^(?:awards?|honors?|achievements?|recognitions?)',
        re.IGNORECASE,
    ),
    'languages': re.compile(
        r'^(?:languages?)',
        re.IGNORECASE,
    ),
    'publications': re.compile(
        r'^(?:publications?|research|papers?)',
        re.IGNORECASE,
    ),
    'volunteer': re.compile(
        r'^(?:volunteer(?:ing)?|community\s*(?:service|involvement))',
        re.IGNORECASE,
    ),
}


# =====================================================================
# CONTACT EXTRACTION
# =====================================================================

_EMAIL_RE = re.compile(r'[\w\.\-+]+@[\w\.\-]+\.\w{2,}')
_PHONE_RE = re.compile(
    r'(?:\+?\d{1,3}[\-.\s]?)?'       # optional country code
    r'\(?\d{3}\)?[\-.\s]?'            # area code
    r'\d{3}[\-.\s]?\d{4}'             # number
)
_LINKEDIN_RE = re.compile(
    r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w\-]+/?',
    re.IGNORECASE,
)
_GITHUB_RE = re.compile(
    r'(?:https?://)?(?:www\.)?github\.com/[\w\-]+/?',
    re.IGNORECASE,
)
_PORTFOLIO_RE = re.compile(
    r'(?:https?://)?(?:www\.)?[\w\-]+\.(?:dev|io|me|com|org|net)/?\S*',
    re.IGNORECASE,
)


def _extract_contact(text, filename=""):
    """
    Extracts structured contact information from the resume text.

    Returns:
        dict with keys: first_name, last_name, email, phone, linkedin,
                        github, portfolio
    """
    email_match = _EMAIL_RE.search(text)
    email = email_match.group(0) if email_match else None

    phone_match = _PHONE_RE.search(text)
    phone = phone_match.group(0) if phone_match else None

    linkedin_match = _LINKEDIN_RE.search(text)
    linkedin = linkedin_match.group(0) if linkedin_match else None

    github_match = _GITHUB_RE.search(text)
    github = github_match.group(0) if github_match else None

    # Portfolio: any URL that isn't LinkedIn/GitHub/email domain
    portfolio = None
    for m in _PORTFOLIO_RE.finditer(text[:800]):  # Only scan top of resume
        url = m.group(0).lower()
        if ('linkedin.com' not in url
                and 'github.com' not in url
                and not _EMAIL_RE.search(url)  # Skip email domains
                and '/' in url.split('.', 1)[-1]):  # Require a path segment
            portfolio = m.group(0)
            break

    # ── Name extraction ──
    # Strategy: use the first non-empty, non-contact line
    lines = [
        ln.strip() for ln in text.split('\n')
        if ln.strip()
        and '---' not in ln
        and 'page' not in ln.lower()
    ]

    name = "Unknown Candidate"
    if lines:
        candidate_line = lines[0]
        # Strip out contact details / section headers that may leak in
        candidate_line = re.sub(
            r'(email|phone|resume|curriculum|cv|summary|address|linkedin|github).*$',
            '', candidate_line, flags=re.IGNORECASE,
        ).strip()
        # Strip trailing title markers (e.g. "John Doe - Software Engineer")
        candidate_line = re.split(r'\s*[\-|]\s*', candidate_line)[0].strip()

        if len(candidate_line) >= 2:
            name = candidate_line

    # Filename fallback (e.g. Alice_Chen_Resume.pdf -> Alice Chen)
    if name == "Unknown Candidate" and filename:
        basename = os.path.splitext(os.path.basename(filename))[0]
        name = (basename
                .replace('_Resume', '').replace('_resume', '')
                .replace('_CV', '').replace('_cv', '')
                .replace('_', ' ').replace('-', ' ').title())

    parts = name.split()
    first_name = parts[0] if parts else "Unknown"
    last_name = " ".join(parts[1:]) if len(parts) > 1 else "Candidate"

    return {
        'first_name': first_name,
        'last_name': last_name,
        'full_name': f"{first_name} {last_name}",
        'email': email,
        'phone': phone,
        'linkedin': linkedin,
        'github': github,
        'portfolio': portfolio,
    }


# =====================================================================
# SECTION SPLITTER
# =====================================================================

def _split_sections(text):
    """
    Splits the resume text into labeled sections based on heading detection.

    Returns:
        dict mapping section name -> list of content lines
        Unmatched content is placed under the 'header' key.
    """
    lines = text.split('\n')
    sections = {'header': []}
    current_section = 'header'

    for line in lines:
        stripped = line.strip()

        # Skip page markers injected by the PDF parser
        if stripped.startswith('--- Page') and stripped.endswith('---'):
            continue

        # Detect section headings
        # Headings are usually short, standalone lines (< 60 chars)
        # that may end with a colon and aren't part of a sentence.
        is_heading = False
        if stripped and len(stripped) < 60:
            # Remove trailing colon, dashes, or equals
            clean = re.sub(r'[\s:\-=_|]+$', '', stripped)
            for section_name, pattern in _SECTION_PATTERNS.items():
                if pattern.match(clean):
                    current_section = section_name
                    if section_name not in sections:
                        sections[section_name] = []
                    is_heading = True
                    break

        if not is_heading:
            sections.setdefault(current_section, []).append(stripped)

    # Strip empty lines from section edges
    for key in sections:
        while sections[key] and not sections[key][0]:
            sections[key].pop(0)
        while sections[key] and not sections[key][-1]:
            sections[key].pop()

    return sections


# =====================================================================
# EDUCATION EXTRACTION
# =====================================================================

_DEGREE_PATTERNS = [
    # Doctorate / PhD
    (re.compile(r'\b(?:ph\.?d\.?|doctor(?:ate)?)\b', re.IGNORECASE), 'Doctorate'),
    # Master's
    (re.compile(
        r'\b(?:m\.?s\.?c?\.?|m\.?a\.?|m\.?b\.?a\.?|m\.?tech\.?|master(?:\'?s)?'
        r'|m\.?eng\.?|m\.?phil\.?)\b', re.IGNORECASE), 'Master\'s'),
    # Bachelor's
    (re.compile(
        r'\b(?:b\.?s\.?c?\.?|b\.?a\.?|b\.?tech\.?|b\.?e\.?|b\.?b\.?a\.?'
        r'|bachelor(?:\'?s)?|b\.?eng\.?)\b', re.IGNORECASE), 'Bachelor\'s'),
    # Associate
    (re.compile(r'\b(?:associate(?:\'?s)?|a\.?s\.?|a\.?a\.?)\b', re.IGNORECASE), 'Associate'),
    # Diploma
    (re.compile(r'\b(?:diploma|certificate|certification)\b', re.IGNORECASE), 'Diploma'),
]

_YEAR_RE = re.compile(r'\b(19|20)\d{2}\b')
_YEAR_RANGE_RE = re.compile(r'((?:19|20)\d{2})\s*[-\u2013\u2014]\s*((?:19|20)\d{2}|[Pp]resent|[Cc]urrent)')
_GPA_RE = re.compile(r'(?:GPA|CGPA|Grade)[:\s]*(\d\.\d+(?:/\d+(?:\.\d+)?)?)', re.IGNORECASE)


def _extract_education(lines):
    """
    Parses education section lines into structured records.

    Returns:
        list of dicts, each with: degree, level, institution, year,
        graduation_year, gpa
    """
    entries = []
    if not lines:
        return entries

    # Group consecutive non-empty lines into blocks (each block = one entry)
    blocks = []
    current_block = []
    for line in lines:
        if line.strip():
            current_block.append(line.strip())
        else:
            if current_block:
                blocks.append(current_block)
                current_block = []
    if current_block:
        blocks.append(current_block)

    # If no clear separation, treat entire section as one block
    if not blocks:
        blocks = [lines]

    for block in blocks:
        combined = ' '.join(block)
        entry = {
            'degree': None,
            'level': None,
            'institution': None,
            'year': None,
            'graduation_year': None,
            'gpa': None,
        }

        # Detect degree level
        for pattern, level in _DEGREE_PATTERNS:
            if pattern.search(combined):
                entry['level'] = level
                break

        # Extract year range or single year
        year_range = _YEAR_RANGE_RE.search(combined)
        if year_range:
            entry['year'] = year_range.group(0)
            grad = year_range.group(2)
            if grad.isdigit():
                entry['graduation_year'] = int(grad)
        else:
            years = _YEAR_RE.findall(combined)
            if years:
                entry['graduation_year'] = int(years[-1])
                entry['year'] = years[-1]

        # Extract GPA
        gpa_match = _GPA_RE.search(combined)
        if gpa_match:
            entry['gpa'] = gpa_match.group(1)

        # The first line of the block is typically the degree or institution
        entry['degree'] = block[0] if block else combined

        # If there's a second line, it's likely the institution
        if len(block) > 1:
            # The institution is usually the line without the degree keyword
            for b_line in block[1:]:
                if not _YEAR_RE.search(b_line) and not _GPA_RE.search(b_line):
                    entry['institution'] = b_line
                    break

        # Only add entries that have at least a degree or level detected
        if entry['degree'] or entry['level']:
            entries.append(entry)

    return entries


# =====================================================================
# EXPERIENCE EXTRACTION
# =====================================================================

_DURATION_RE = re.compile(
    r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s*\d{4})'
    r'\s*[-\u2013\u2014]\s*'
    r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\.?\s*\d{4}|[Pp]resent|[Cc]urrent)',
    re.IGNORECASE,
)


def _extract_experience(lines):
    """
    Parses experience section lines into structured records.

    Returns:
        list of dicts, each with: role, company, duration, start_date,
        end_date, is_current, responsibilities (list)
    """
    entries = []
    if not lines:
        return entries

    # Group consecutive non-empty lines into blocks
    blocks = []
    current_block = []
    for line in lines:
        if line.strip():
            current_block.append(line.strip())
        else:
            if current_block:
                blocks.append(current_block)
                current_block = []
    if current_block:
        blocks.append(current_block)

    if not blocks:
        blocks = [lines]

    for block in blocks:
        combined = ' '.join(block)
        entry = {
            'role': None,
            'company': None,
            'duration': None,
            'start_date': None,
            'end_date': None,
            'is_current': False,
            'responsibilities': [],
        }

        # Extract duration
        dur_match = _DURATION_RE.search(combined)
        if dur_match:
            entry['start_date'] = dur_match.group(1)
            entry['end_date'] = dur_match.group(2)
            entry['duration'] = dur_match.group(0)
            entry['is_current'] = dur_match.group(2).lower() in ('present', 'current')

        # First line is typically role or "Role at Company" / "Role | Company"
        if block:
            title_line = block[0]
            # Try splitting by common separators
            for sep in [' at ', ' @ ', ' | ', ' - ', ', ']:
                if sep in title_line:
                    parts = title_line.split(sep, 1)
                    entry['role'] = parts[0].strip()
                    entry['company'] = parts[1].strip()
                    break
            else:
                entry['role'] = title_line

        # If second line looks like a company name (short, no bullet)
        if len(block) > 1 and entry['company'] is None:
            second = block[1]
            if (len(second) < 80
                    and not second.startswith(('-', '*', '\u2022'))
                    and not _DURATION_RE.search(second)):
                entry['company'] = second

        # Remaining lines with bullets are responsibilities
        for b_line in block[1:]:
            cleaned = re.sub(r'^[\-\*\u2022\u25e6\u2023\u25aa\u25cf]\s*', '', b_line).strip()
            if cleaned and cleaned != entry.get('company'):
                entry['responsibilities'].append(cleaned)

        if entry['role']:
            entries.append(entry)

    return entries


# =====================================================================
# PROJECTS EXTRACTION
# =====================================================================

def _extract_projects(lines):
    """
    Parses project section lines into structured records.

    Returns:
        list of dicts, each with: name, description, technologies (list)
    """
    entries = []
    if not lines:
        return entries

    blocks = []
    current_block = []
    for line in lines:
        if line.strip():
            current_block.append(line.strip())
        else:
            if current_block:
                blocks.append(current_block)
                current_block = []
    if current_block:
        blocks.append(current_block)

    if not blocks:
        blocks = [lines]

    tech_re = re.compile(
        r'(?:tech(?:nolog(?:ies|y))?|tools?|stack|built\s+with|using)'
        r'\s*[:\-]\s*(.+)',
        re.IGNORECASE,
    )

    for block in blocks:
        entry = {
            'name': block[0] if block else None,
            'description': [],
            'technologies': [],
        }

        for b_line in block[1:]:
            tech_match = tech_re.search(b_line)
            if tech_match:
                techs = re.split(r'[,;|]', tech_match.group(1))
                entry['technologies'] = [t.strip() for t in techs if t.strip()]
            else:
                cleaned = re.sub(r'^[\-\*\u2022]\s*', '', b_line).strip()
                if cleaned:
                    entry['description'].append(cleaned)

        entry['description'] = ' '.join(entry['description']) if entry['description'] else None

        if entry['name']:
            entries.append(entry)

    return entries


# =====================================================================
# CERTIFICATIONS EXTRACTION
# =====================================================================

def _extract_certifications(lines):
    """
    Parses certification section lines into structured records.

    Returns:
        list of dicts, each with: name, issuer, year
    """
    entries = []
    if not lines:
        return entries

    issuer_re = re.compile(
        r'(?:by|from|issued\s*by|issuer|provider)[:\s]*(.+)',
        re.IGNORECASE,
    )

    for line in lines:
        if not line.strip():
            continue

        cleaned = re.sub(r'^[\-\*\u2022\d+\.]\s*', '', line).strip()
        if not cleaned or len(cleaned) < 3:
            continue

        entry = {
            'name': cleaned,
            'issuer': None,
            'year': None,
        }

        # Extract year
        year_match = _YEAR_RE.search(cleaned)
        if year_match:
            entry['year'] = int(year_match.group(0))

        # Extract issuer
        issuer_match = issuer_re.search(cleaned)
        if issuer_match:
            entry['issuer'] = issuer_match.group(1).strip()
            # Remove the "by ..." part from the name
            entry['name'] = cleaned[:issuer_match.start()].strip().rstrip(',').rstrip('-').strip()

        if entry['name']:
            entries.append(entry)

    return entries


# =====================================================================
# SKILLS EXTRACTION (Standalone, no DB dependency)
# =====================================================================

# Comprehensive skill keyword list, grouped by category.
# This allows the service to work independently of the database.
_SKILL_KEYWORDS = {
    'Programming': [
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby',
        'go', 'rust', 'swift', 'kotlin', 'scala', 'perl', 'php', 'r',
        'matlab', 'dart', 'lua', 'haskell', 'elixir',
    ],
    'Web Development': [
        'html', 'css', 'react', 'angular', 'vue', 'svelte', 'next.js',
        'node.js', 'express', 'django', 'flask', 'fastapi', 'spring',
        'rails', 'laravel', 'bootstrap', 'tailwind', 'sass', 'webpack',
        'graphql', 'rest api',
    ],
    'Data & Analytics': [
        'sql', 'pandas', 'numpy', 'spark', 'hadoop', 'hive', 'kafka',
        'airflow', 'dbt', 'snowflake', 'redshift', 'bigquery', 'tableau',
        'power bi', 'looker', 'excel', 'etl', 'data analysis',
        'data engineering', 'data science', 'statistics', 'analytics',
        'matplotlib', 'seaborn', 'plotly',
    ],
    'AI & ML': [
        'machine learning', 'deep learning', 'nlp',
        'natural language processing', 'computer vision', 'tensorflow',
        'pytorch', 'scikit-learn', 'keras', 'neural network',
        'generative ai', 'llm', 'hugging face', 'opencv', 'xgboost',
        'reinforcement learning',
    ],
    'Cloud & DevOps': [
        'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
        'terraform', 'ansible', 'jenkins', 'ci/cd', 'devops', 'linux',
        'git', 'github', 'gitlab', 'bitbucket', 'nginx', 'heroku',
        'vercel', 'netlify',
    ],
    'Databases': [
        'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
        'dynamodb', 'cassandra', 'neo4j', 'oracle', 'sqlite',
        'firebase', 'supabase', 'couchdb',
    ],
    'Soft Skills': [
        'communication', 'leadership', 'teamwork', 'problem solving',
        'project management', 'agile', 'scrum', 'presentation',
        'collaboration', 'critical thinking', 'time management',
        'negotiation', 'mentoring',
    ],
}

# Pre-compile for performance
_SKILL_REGEXES = {}
for _cat, _keywords in _SKILL_KEYWORDS.items():
    for _kw in _keywords:
        _SKILL_REGEXES[_kw] = (
            re.compile(r'\b' + re.escape(_kw) + r'\b', re.IGNORECASE),
            _cat,
        )


# Well-known display name corrections for skill names
_DISPLAY_NAME_FIXES = {
    'Ci/Cd': 'CI/CD', 'Nlp': 'NLP', 'Llm': 'LLM', 'Etl': 'ETL',
    'Aws': 'AWS', 'Gcp': 'GCP', 'Html': 'HTML', 'Css': 'CSS',
    'Sql': 'SQL', 'GIT': 'Git', 'Rest Api': 'REST API',
    'Graphql': 'GraphQL', 'Mongodb': 'MongoDB',
    'Postgresql': 'PostgreSQL', 'Mysql': 'MySQL',
    'Dynamodb': 'DynamoDB', 'Neo4J': 'Neo4j', 'Sqlite': 'SQLite',
    'Opencv': 'OpenCV', 'Xgboost': 'XGBoost',
    'Next.Js': 'Next.js', 'Node.Js': 'Node.js',
    'Numpy': 'NumPy', 'Scipy': 'SciPy',
    'Scikit-Learn': 'scikit-learn', 'Pytorch': 'PyTorch',
    'Tensorflow': 'TensorFlow', 'Github': 'GitHub',
    'Gitlab': 'GitLab', 'Bitbucket': 'Bitbucket',
    'Fastapi': 'FastAPI', 'Devops': 'DevOps',
}


def _extract_skills_standalone(text, skill_section_lines=None):
    """
    Extracts skills from resume text using regex matching against a
    built-in keyword library (no database dependency).

    If skill_section_lines is provided (from the parsed "Skills" section),
    those are prioritized for comma/semicolon-separated extraction.

    Returns:
        list of dicts, each with: name, category
    """
    found = {}  # skill_key -> {name, category}

    # Method 1: Parse the dedicated Skills section if available
    if skill_section_lines:
        combined = ' '.join(skill_section_lines)
        # Split by common delimiters
        tokens = re.split(r'[,;|/\n]', combined)
        for token in tokens:
            token = token.strip().strip('-').strip('*').strip()
            if not token or len(token) < 2:
                continue
            # Check against our keyword library
            key = token.lower()
            if key in _SKILL_REGEXES:
                pattern, category = _SKILL_REGEXES[key]
                display = token.title() if len(token) > 3 else token.upper()
                display = _DISPLAY_NAME_FIXES.get(display, display)
                found[key] = {'name': display, 'category': category}

    # Method 2: Regex scan across the full resume text
    for keyword, (pattern, category) in _SKILL_REGEXES.items():
        if keyword not in found and pattern.search(text):
            display = keyword.title() if len(keyword) > 3 else keyword.upper()
            display = _DISPLAY_NAME_FIXES.get(display, display)
            found[keyword] = {'name': display, 'category': category}

    return list(found.values())


# =====================================================================
# SUMMARY / OBJECTIVE EXTRACTION
# =====================================================================

def _extract_summary(lines):
    """
    Returns the professional summary/objective as a single string.
    """
    if not lines:
        return None
    return ' '.join(ln for ln in lines if ln.strip())


# =====================================================================
# PUBLIC API: analyze_resume()
# =====================================================================

def analyze_resume(raw_text, filename=""):
    """
    Main entry point. Accepts raw resume text and returns a normalized,
    structured candidate profile dictionary.

    Args:
        raw_text (str): Full text extracted from a PDF resume
                        (output of resume_parser.extract_text_from_pdf).
        filename (str): Original filename, used as a fallback for name
                        extraction (e.g. "Alice_Chen_Resume.pdf").

    Returns:
        dict: A structured candidate profile with the following shape:

        {
            "contact": {
                "first_name": str,
                "last_name": str,
                "full_name": str,
                "email": str | None,
                "phone": str | None,
                "linkedin": str | None,
                "github": str | None,
                "portfolio": str | None,
            },
            "summary": str | None,
            "skills": [
                {"name": str, "category": str},
                ...
            ],
            "education": [
                {
                    "degree": str,
                    "level": str | None,   # "Bachelor's", "Master's", ...
                    "institution": str | None,
                    "year": str | None,
                    "graduation_year": int | None,
                    "gpa": str | None,
                },
                ...
            ],
            "experience": [
                {
                    "role": str,
                    "company": str | None,
                    "duration": str | None,
                    "start_date": str | None,
                    "end_date": str | None,
                    "is_current": bool,
                    "responsibilities": [str],
                },
                ...
            ],
            "projects": [
                {
                    "name": str,
                    "description": str | None,
                    "technologies": [str],
                },
                ...
            ],
            "certifications": [
                {
                    "name": str,
                    "issuer": str | None,
                    "year": int | None,
                },
                ...
            ],
            "metadata": {
                "source_filename": str,
                "parsed_at": str,        # ISO 8601 timestamp
                "raw_text_length": int,
                "sections_detected": [str],
            },
        }
    """
    if not raw_text:
        return _empty_profile(filename)

    # Step 1: Split text into labeled sections
    sections = _split_sections(raw_text)

    # Step 2: Extract structured data from each section
    contact = _extract_contact(raw_text, filename=filename)
    summary = _extract_summary(sections.get('summary', []))
    skills = _extract_skills_standalone(
        raw_text,
        skill_section_lines=sections.get('skills'),
    )
    education = _extract_education(sections.get('education', []))
    experience = _extract_experience(sections.get('experience', []))
    projects = _extract_projects(sections.get('projects', []))
    certifications = _extract_certifications(sections.get('certifications', []))

    # Step 3: Build metadata
    detected = [s for s in sections if s != 'header' and sections[s]]
    metadata = {
        'source_filename': filename or 'unknown',
        'parsed_at': datetime.utcnow().isoformat() + 'Z',
        'raw_text_length': len(raw_text),
        'sections_detected': detected,
    }

    return {
        'contact': contact,
        'summary': summary,
        'skills': skills,
        'education': education,
        'experience': experience,
        'projects': projects,
        'certifications': certifications,
        'metadata': metadata,
    }


def _empty_profile(filename=""):
    """Returns an empty but correctly shaped profile dict."""
    return {
        'contact': {
            'first_name': 'Unknown', 'last_name': 'Candidate',
            'full_name': 'Unknown Candidate',
            'email': None, 'phone': None, 'linkedin': None,
            'github': None, 'portfolio': None,
        },
        'summary': None,
        'skills': [],
        'education': [],
        'experience': [],
        'projects': [],
        'certifications': [],
        'metadata': {
            'source_filename': filename or 'unknown',
            'parsed_at': datetime.utcnow().isoformat() + 'Z',
            'raw_text_length': 0,
            'sections_detected': [],
        },
    }


# =====================================================================
# CONVENIENCE: get_skills_flat()
# =====================================================================

def get_skills_flat(profile):
    """
    Convenience helper. Given a profile dict from analyze_resume(),
    returns a flat list of skill name strings (for compatibility with
    matching_engine.save_candidate_profile).

    Example:
        profile = analyze_resume(text)
        skill_names = get_skills_flat(profile)
        # ['Python', 'SQL', 'Machine Learning', ...]
    """
    return [s['name'] for s in profile.get('skills', [])]


def get_skills_by_category(profile):
    """
    Convenience helper. Groups skills by category.

    Returns:
        dict mapping category -> list of skill name strings
        e.g. {'Programming': ['Python', 'Java'], 'Data & Analytics': ['SQL']}
    """
    grouped = {}
    for skill in profile.get('skills', []):
        cat = skill.get('category', 'Other')
        grouped.setdefault(cat, []).append(skill['name'])
    return grouped
