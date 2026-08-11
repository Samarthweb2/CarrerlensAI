import logging
from typing import Dict, Any, List, Optional, Set, Tuple
from sqlalchemy.orm import Session
from database.models import JobRole

logger = logging.getLogger(__name__)

SOFT_SKILLS: Set[str] = {
    'communication', 'leadership', 'teamwork', 'problem solving', 'presentation',
    'collaboration', 'critical thinking', 'agile', 'scrum', 'project management',
    'management', 'negotiation', 'organization', 'time management', 'detail oriented',
    'multitasking', 'interpersonal skills', 'self-starter', 'work ethic', 'adaptability'
}

def format_salary_range(salary_min: Optional[int], salary_max: Optional[int]) -> str:
    """Helper to format job role salaries from DB values (USD annual or INR LPA)."""
    if not salary_min and not salary_max:
        return "₹8–15 LPA"
    s_min = salary_min or int(salary_max * 0.7)
    s_max = salary_max or int(salary_min * 1.3)
    
    if 20000 <= s_min <= 500000:
        return f"${s_min // 1000}k–${s_max // 1000}k / yr"
    elif s_min > 500000:
        return f"₹{s_min // 100000}–{s_max // 100000} LPA"
    else:
        return "₹8–15 LPA"

def detect_candidate_domain(skills_lower: set) -> str:
    """
    Detects candidate's primary technical domain (frontend, backend, data, devops, mobile, cybersecurity, general)
    by counting skill frequency across domain definitions.
    """
    scores = {
        'frontend': 0,
        'backend': 0,
        'data': 0,
        'devops': 0,
        'mobile': 0,
        'cybersecurity': 0
    }
    
    frontend_kw = {'react', 'html', 'css', 'javascript', 'typescript', 'vue', 'angular', 'svelte', 'next.js', 'tailwind', 'sass', 'webpack', 'bootstrap', 'redux', 'vite', 'figma', 'ui', 'ux', 'responsive design'}
    backend_kw = {'node.js', 'express', 'fastapi', 'django', 'flask', 'python', 'java', 'spring', 'c#', '.net', 'ruby', 'rails', 'php', 'laravel', 'go', 'rust', 'rest api', 'graphql', 'microservices', 'redis', 'rabbitmq', 'kafka', 'postgresql', 'mysql', 'mongodb', 'sqlite'}
    data_kw = {
        'pandas', 'numpy', 'sql', 'tableau', 'power bi', 'spark', 'pyspark', 'hadoop', 'hive', 'dbt',
        'snowflake', 'redshift', 'bigquery', 'etl', 'data analysis', 'data science', 'data scientist',
        'statistics', 'analytics', 'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch',
        'scikit-learn', 'excel', 'looker', 'rag', 'agentic ai', 'multi-agent systems', 'llm', 'llms',
        'langchain', 'langgraph', 'llamaindex', 'ragas', 'langsmith', 'statistical modeling',
        'time series', 'marketing mix modeling', 'recommender systems', 'multimodal ai', 'bayesian modeling',
        'bayesian', 'transformers', 'genai', 'azure ai studio', 'airflow'
    }
    devops_kw = {'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'devops', 'linux', 'nginx', 'sysadmin', 'cloud'}
    mobile_kw = {'swift', 'kotlin', 'react native', 'flutter', 'ios', 'android', 'mobile'}
    security_kw = {'security', 'cybersecurity', 'penetration testing', 'cryptography', 'firewall', 'siem'}

    for s in skills_lower:
        s_clean = s.lower()
        if s_clean in frontend_kw: scores['frontend'] += 1
        if s_clean in backend_kw: scores['backend'] += 1
        if s_clean in data_kw or any(dk in s_clean for dk in ['data', 'learning', 'ai', 'model', 'analytics']): scores['data'] += 1.5
        if s_clean in devops_kw: scores['devops'] += 1
        if s_clean in mobile_kw: scores['mobile'] += 1
        if s_clean in security_kw: scores['cybersecurity'] += 1

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    if sorted_scores[0][1] > 0:
        return sorted_scores[0][0]
    return 'general'

def detect_domain_weighted(skills_lower: list) -> str:
    """
    Weighted domain detection for heuristic fallbacks.
    """
    domain_keywords = {
        'frontend': {
            'react', 'html', 'css', 'javascript', 'typescript', 'vue', 'angular',
            'svelte', 'next.js', 'tailwind', 'sass', 'webpack', 'bootstrap',
            'frontend', 'ui', 'ux', 'web design', 'figma', 'responsive design',
            'jquery', 'redux', 'vite',
        },
        'backend': {
            'node.js', 'express', 'fastapi', 'django', 'flask', 'spring',
            'rails', 'laravel', 'backend', 'rest api', 'graphql', 'microservices',
            'redis', 'rabbitmq', 'kafka', 'grpc',
        },
        'devops': {
            'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform',
            'ansible', 'jenkins', 'ci/cd', 'devops', 'linux', 'nginx',
            'heroku', 'vercel', 'netlify', 'cloud', 'monitoring',
        },
        'data': {
            'pandas', 'numpy', 'power bi', 'tableau', 'spark', 'pyspark', 'hadoop',
            'machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch',
            'scikit-learn', 'data science', 'data scientist', 'data analyst', 'data engineering',
            'statistics', 'analytics', 'matplotlib', 'seaborn', 'airflow',
            'dbt', 'snowflake', 'bigquery', 'etl', 'excel', 'looker', 'rag',
            'agentic ai', 'multi-agent systems', 'llm', 'llms', 'langchain',
            'langgraph', 'llamaindex', 'ragas', 'langsmith', 'statistical modeling',
            'time series', 'marketing mix modeling', 'recommender systems',
            'multimodal ai', 'bayesian modeling', 'bayesian', 'transformers', 'genai',
        },
    }

    scores = {}
    for domain, keywords in domain_keywords.items():
        score = sum(1 for s in skills_lower if s.lower() in keywords)
        scores[domain] = score

    backend_devops_score = scores.get('backend', 0) + scores.get('devops', 0)
    frontend_score = scores.get('frontend', 0)
    data_score = scores.get('data', 0)

    max_score = max(frontend_score, backend_devops_score, data_score)
    if max_score == 0:
        return 'general'
    if data_score == max_score:
        return 'data'
    if frontend_score == max_score:
        return 'frontend'
    if backend_devops_score == max_score:
        return 'backend_devops'
    return 'data'

def match_jobs_from_db(parsed_resume: Dict[str, Any], job_description: Optional[str], db: Session) -> Tuple[List[Dict[str, Any]], List[str], str, Optional[str]]:
    """
    Queries database job postings, computes Jaccard set-based skill overlap,
    and returns top job matches and missing technical skills.
    """
    job_matches = []
    missing_skills_from_db = []
    top_matches_text = ""
    target_jd = job_description

    try:
        user_skills_raw = [s.lower() for s in parsed_resume.get("skills", [])]
        user_skills = set(user_skills_raw)
        tech_user_skills = set([s for s in user_skills if s not in SOFT_SKILLS])
        
        domain = detect_candidate_domain(user_skills)
        logger.info(f"Candidate domain detected: {domain} (Tech Skills: {tech_user_skills})")
        
        from sqlalchemy import or_, cast, String
        
        domain_title_keywords = {
            'frontend': ['frontend', 'react', 'ui', 'web', 'full stack'],
            'backend': ['backend', 'api', 'python', 'java', 'node', 'systems engineer', 'backend engineer'],
            'data': ['data scientist', 'data science', 'machine learning', 'ml engineer', 'data engineer', 'ai engineer', 'data analyst', 'analytics', 'bi', 'scientist'],
            'devops': ['devops', 'cloud', 'sre', 'infrastructure', 'kubernetes', 'aws engineer'],
            'mobile': ['mobile', 'ios', 'android', 'flutter', 'react native'],
            'cybersecurity': ['security', 'cyber', 'analyst', 'security engineer'],
            'general': ['software engineer', 'developer', 'analyst']
        }
        
        kw_list = domain_title_keywords.get(domain, domain_title_keywords['general'])
        title_filters = [JobRole.title.ilike(f'%{kw}%') for kw in kw_list]
        
        skill_filters = []
        for sk in list(tech_user_skills)[:12]:
            clean_sk = sk.replace('"', '').replace('%', '').strip()
            if clean_sk:
                skill_filters.append(cast(JobRole.required_skills, String).ilike(f'%{clean_sk}%'))
                skill_filters.append(cast(JobRole.ats_keywords, String).ilike(f'%{clean_sk}%'))

        if title_filters and skill_filters:
            query_filter = or_(*title_filters) & or_(*skill_filters)
            roles = db.query(
                JobRole.title, JobRole.company, JobRole.location, JobRole.industry,
                JobRole.description, JobRole.required_skills, JobRole.preferred_skills,
                JobRole.salary_min, JobRole.salary_max, JobRole.work_type, JobRole.ats_keywords
            ).filter(query_filter).limit(1000).all()
        else:
            roles = db.query(
                JobRole.title, JobRole.company, JobRole.location, JobRole.industry,
                JobRole.description, JobRole.required_skills, JobRole.preferred_skills,
                JobRole.salary_min, JobRole.salary_max, JobRole.work_type, JobRole.ats_keywords
            ).filter(or_(*title_filters) if title_filters else True).limit(500).all()
            
        scored_roles = []
        for r in roles:
            raw_role_skills = set([s.lower() for s in (r.required_skills or [])] + [s.lower() for s in (r.ats_keywords or [])])
            tech_role_skills = set([s for s in raw_role_skills if s not in SOFT_SKILLS])
            
            if not tech_role_skills:
                continue

            overlap = len(tech_user_skills.intersection(tech_role_skills))
            if overlap == 0:
                continue

            coverage = overlap / len(tech_role_skills)
            jaccard = overlap / len(tech_user_skills.union(tech_role_skills)) if tech_user_skills.union(tech_role_skills) else 0
            sim = (0.6 * coverage) + (0.4 * jaccard)

            if overlap >= 3 and coverage >= 0.5:
                match_score = min(94, round(75 + (sim * 20)))
            elif overlap >= 2:
                match_score = min(84, max(65, round(62 + (sim * 22))))
            else:
                match_score = min(68, max(52, round(48 + (sim * 22))))

            scored_roles.append((match_score, r))
            
        scored_roles.sort(key=lambda x: x[0], reverse=True)
        top_20 = scored_roles[:20]
        top_5 = scored_roles[:5]
        
        colors = ["#4285F4", "#F25022", "#FF9900", "#007CC3", "#34A853"]
        job_matches = []
        for i, (score, r) in enumerate(top_5):
            salary_str = format_salary_range(r.salary_min, r.salary_max)
            
            job_matches.append({
                "company": r.company or "Tech Enterprise",
                "role": r.title,
                "match": score,
                "salary": salary_str,
                "location": r.location or "Remote",
                "logo": r.company[0] if r.company else r.title[0],
                "color": colors[i % len(colors)]
            })
        
        aggregated_required_skills = {}
        for score, r in top_20:
            for skill in (r.required_skills or []):
                skill_lower = skill.lower()
                if skill_lower not in tech_user_skills and skill_lower not in SOFT_SKILLS and len(skill_lower) <= 30:
                    aggregated_required_skills[skill_lower] = aggregated_required_skills.get(skill_lower, 0) + 1
        
        sorted_aggregated_skills = sorted(aggregated_required_skills.items(), key=lambda x: x[1], reverse=True)
        
        missing_set = []
        for skill_lower, freq in sorted_aggregated_skills[:15]:
            try:
                from etl_pipeline import standardize_skill_name
                proper_name = standardize_skill_name(skill_lower)
            except ImportError:
                proper_name = skill_lower.title()
            if proper_name not in missing_set and proper_name.lower() not in SOFT_SKILLS:
                missing_set.append(proper_name)
        missing_skills_from_db = missing_set[:5]
        
        top_matches_text = "\n".join([
            f"- {r.title} at {r.company} (Match Score: {score}%)"
            for score, r in top_5
        ])
        
        if not target_jd and top_5:
            top_role = top_5[0][1]
            target_jd = f"Target Role: {top_role.title}\nCompany: {top_role.company}\nDescription: {top_role.description}\nRequired Skills: {', '.join(top_role.required_skills or [])}\nATS Keywords: {', '.join(top_role.ats_keywords or [])}"
            logger.info(f"Using database matched role as target JD: {top_role.title}")
            
    except Exception as e:
        logger.error(f"Failed to match against PostgreSQL/SQLite Job Knowledge Base: {e}")
        try:
            db.rollback()
        except Exception:
            pass

    return job_matches, missing_skills_from_db, top_matches_text, target_jd
