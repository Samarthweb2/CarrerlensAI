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

PARENT_SKILL_MAP: Dict[str, Set[str]] = {
    'next.js': {'react', 'javascript', 'typescript', 'frontend'},
    'react native': {'react', 'mobile', 'javascript', 'typescript'},
    'fastapi': {'python', 'backend', 'rest api'},
    'flask': {'python', 'backend'},
    'django': {'python', 'backend', 'sql'},
    'express.js': {'node.js', 'javascript', 'backend'},
    'pyspark': {'spark', 'python', 'big data', 'sql'},
    'dbt': {'sql', 'data engineering'},
    'airflow': {'python', 'etl', 'data engineering'},
    'pytorch': {'python', 'machine learning', 'deep learning', 'ai'},
    'tensorflow': {'python', 'machine learning', 'deep learning', 'ai'},
    'langchain': {'llm', 'rag', 'genai', 'python'},
    'cypress': {'testing', 'qa', 'automation'},
    'playwright': {'testing', 'qa', 'automation'},
    'selenium': {'testing', 'qa', 'automation'},
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
    Detects candidate's primary domain across 30+ tech and non-tech domains
    aligned with the complete roadmap.sh dataset.
    """
    try:
        from services.ai.roadmap_sh_taxonomy import ROADMAP_SH_TAXONOMY
        domain_tax = ROADMAP_SH_TAXONOMY
    except ImportError:
        domain_tax = {}

    if not domain_tax:
        return 'full_stack'

    scores = {domain_key: 0.0 for domain_key in domain_tax.keys()}

    for sk in skills_lower:
        sk_clean = sk.lower().strip()
        for domain_key, info in domain_tax.items():
            kws = info.get("keywords", set())
            if sk_clean in kws:
                # Add higher weight for explicit domain keywords
                weight = 3.0 if domain_key in ('ai_engineer', 'ai_data_scientist', 'product_manager', 'cyber_security') else 2.0
                scores[domain_key] += weight

    best_domain = max(scores.items(), key=lambda x: x[1])
    if best_domain[1] == 0.0:
        return 'full_stack'
    return best_domain[0]

# Backward-compatibility alias for heuristics.py
detect_domain_weighted = detect_candidate_domain
detect_domain_weighted = detect_candidate_domain

def extract_ranking_features(tech_user_skills: Set[str], candidate_text: str, candidate_domain: str, role: Any) -> Dict[str, float]:
    """
    Extracts 9 quantitative ranking features for a Candidate-Job pair.
    """
    role_title_lower = (role.title or '').lower()
    req_skills = set([s.lower() for s in (role.required_skills or []) if s.lower() not in SOFT_SKILLS])
    pref_skills = set([s.lower() for s in (role.preferred_skills or []) if s.lower() not in SOFT_SKILLS])
    ats_keywords = set([s.lower() for s in (role.ats_keywords or []) if s.lower() not in SOFT_SKILLS])
    
    if not req_skills:
        req_skills = ats_keywords or {'software'}

    # 1. Required Skill Coverage + Parent-Child Taxonomy Credit
    direct_req_overlap = tech_user_skills.intersection(req_skills)
    parent_credit = 0.0
    for cand_skill in tech_user_skills:
        if cand_skill in PARENT_SKILL_MAP:
            parents = PARENT_SKILL_MAP[cand_skill]
            for parent in parents:
                if parent in req_skills and parent not in direct_req_overlap:
                    parent_credit += 0.75

    effective_req_overlap = len(direct_req_overlap) + parent_credit
    req_coverage = min(1.0, effective_req_overlap / len(req_skills)) if req_skills else 0.0

    # 2. Preferred Skill Coverage
    pref_overlap = len(tech_user_skills.intersection(pref_skills)) if pref_skills else 0
    pref_coverage = (pref_overlap / len(pref_skills)) if pref_skills else req_coverage

    # 3. Title Similarity (Engineering Target Alignment)
    title_terms = {'developer', 'engineer', 'architect', 'scientist', 'analyst', 'specialist', 'lead', 'programmer'}
    title_words = set(role_title_lower.split())
    has_eng_title = len(title_words.intersection(title_terms)) > 0
    
    target_kws = {'react', 'frontend', 'backend', 'fullstack', 'data', 'devops', 'mobile', 'security', 'qa', 'embedded', 'ai', 'ml'}
    domain_kw_match = any(kw in role_title_lower for kw in target_kws if kw in candidate_domain or any(kw in s for s in tech_user_skills))
    
    if domain_kw_match and has_eng_title:
        title_sim = 1.0
    elif has_eng_title:
        title_sim = 0.7
    elif 'designer' in role_title_lower or 'manager' in role_title_lower or 'recruiter' in role_title_lower:
        title_sim = 0.15
    else:
        title_sim = 0.4

    # 4. Domain Similarity
    is_domain_match = (candidate_domain in role_title_lower) or domain_kw_match or (candidate_domain == 'general')
    domain_sim = 1.0 if is_domain_match else 0.10

    # 5. Seniority Gap
    cand_text_lower = (candidate_text or '').lower()
    is_fresher = any(kw in cand_text_lower for kw in ['fresher', 'intern', 'student', 'graduate', '0 years', '1 year']) or ('senior' not in cand_text_lower and 'lead' not in cand_text_lower and '3+' not in cand_text_lower)
    is_principal_role = any(kw in role_title_lower for kw in ['principal', 'staff', 'director', 'vp', 'head'])
    seniority_gap = 0.2 if (is_fresher and is_principal_role) else 1.0

    # 6. Skill Relationship Score
    skill_rel_score = min(1.0, parent_credit / max(1, len(tech_user_skills)))

    # 7. Experience Match
    exp_match = 1.0 if not (is_fresher and is_principal_role) else 0.4

    # 8. Location Match
    loc_match = 1.0

    # 9. Salary Match
    sal_match = 1.0

    return {
        "required_skill_coverage": float(req_coverage),
        "preferred_skill_coverage": float(pref_coverage),
        "title_similarity": float(title_sim),
        "domain_similarity": float(domain_sim),
        "seniority_gap": float(seniority_gap),
        "skill_relationship_score": float(skill_rel_score),
        "experience_match": float(exp_match),
        "location_match": float(loc_match),
        "salary_match": float(sal_match)
    }

def calculate_engine_v2_score(features: Dict[str, float]) -> int:
    """
    Computes Engine v2 Weighted Ranking Score.
    Engine v2 Score = (0.45*Req + 0.15*Pref + 0.20*Title + 0.10*Seniority + 0.10*SkillRel) * DomainSim
    """
    weighted_score = (
        0.45 * features["required_skill_coverage"] +
        0.15 * features["preferred_skill_coverage"] +
        0.20 * features["title_similarity"] +
        0.10 * features["seniority_gap"] +
        0.10 * features["skill_relationship_score"]
    ) * features["domain_similarity"]

    final_pct = min(98, max(35, round(weighted_score * 98)))
    return final_pct

def match_jobs_from_db(
    parsed_resume: Dict[str, Any], 
    target_jd: Optional[str] = None, 
    db: Optional[Session] = None
) -> Tuple[List[Dict[str, Any]], List[str], str, Optional[str]]:
    """
    Executes Engine v2 DB Job Matching across 115k DB Job Dataset.
    Returns: (job_matches, missing_skills, top_matches_text, target_jd)
    """
    job_matches: List[Dict[str, Any]] = []
    missing_skills_from_db: List[str] = []
    top_matches_text: str = ""

    user_skills = set([s.lower().strip() for s in parsed_resume.get("skills", []) if isinstance(s, str)])
    tech_user_skills = set([s for s in user_skills if s not in SOFT_SKILLS])

    domain = detect_candidate_domain(user_skills)
    cand_text = parsed_resume.get("text", "")

    if db:
        try:
            from sqlalchemy import or_, cast, String
            
            domain_title_keywords = {
                'genai_agentic': ['data scientist', 'genai', 'rag', 'machine learning', 'ml engineer', 'ai engineer', 'applied scientist', 'scientist'],
                'data_science_ml': ['data scientist', 'data science', 'machine learning', 'ml engineer', 'applied scientist', 'statistician', 'scientist'],
                'data_engineering': ['data engineer', 'big data', 'etl engineer', 'data pipeline', 'data architect', 'analytics engineer'],
                'backend_systems': ['backend', 'api', 'python', 'java', 'node', 'fastapi', 'systems engineer', 'software engineer'],
                'frontend_ui': ['frontend', 'react', 'ui', 'web', 'frontend engineer'],
                'fullstack': ['full stack', 'fullstack', 'software engineer', 'web developer', 'application engineer'],
                'devops_sre': ['devops', 'cloud', 'sre', 'infrastructure', 'kubernetes', 'aws engineer', 'site reliability'],
                'mobile_dev': ['mobile', 'ios', 'android', 'flutter', 'react native', 'mobile engineer'],
                'cybersecurity': ['security', 'cyber', 'analyst', 'security engineer', 'pentester'],
                'embedded_iot': ['embedded', 'firmware', 'iot', 'c++', 'microcontroller', 'hardware engineer'],
                'qa_automation': ['qa', 'test', 'automation', 'quality engineer', 'test engineer', 'sdet'],
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
                feat = extract_ranking_features(tech_user_skills, cand_text, domain, r)
                score = calculate_engine_v2_score(feat)
                
                if feat["required_skill_coverage"] > 0 or feat["title_similarity"] >= 0.7:
                    scored_roles.append((score, r, feat))
                
            scored_roles.sort(key=lambda x: x[0], reverse=True)
            top_20 = [(item[0], item[1]) for item in scored_roles[:20]]
            top_5 = [(item[0], item[1]) for item in scored_roles[:5]]
            
            colors = ["#4285F4", "#F25022", "#FF9900", "#007CC3", "#34A853"]
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
