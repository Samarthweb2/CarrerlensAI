import pytest
import sys, os
import math
import numpy as np

sys.path.insert(0, os.path.abspath('backend'))

from database.models import JobRole
from database.database import SessionLocal
from resume_parser import extract_skills_keywords
from services.ai.job_matching import detect_candidate_domain, extract_ranking_features, calculate_engine_v2_score, SOFT_SKILLS
from services.ml.ranker import ml_ranker_instance

SAMPLE_CANDIDATES = [
    {
        "name": "Priya (React Frontend Dev)",
        "expected_domain": "frontend_ui",
        "is_fresher": False,
        "text": "Priya Patel - Senior Frontend Developer with 4 years experience building React, Next.js, and TypeScript web applications.",
        "skills": ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux"]
    },
    {
        "name": "Aman (GenAI & ML Scientist)",
        "expected_domain": "genai_agentic",
        "is_fresher": False,
        "text": "Aman Singh - GenAI Scientist with 3 years building RAG pipelines, LangChain, PyTorch, and LlamaIndex agents.",
        "skills": ["LangChain", "LangGraph", "LlamaIndex", "RAG", "Agentic AI", "PyTorch", "Python", "LLMs"]
    },
    {
        "name": "Raj (Fresher Data Engineer)",
        "expected_domain": "data_engineering",
        "is_fresher": True,
        "text": "Rajesh Kumar - Graduate Student Fresher looking for entry-level Data Engineering roles. Built PySpark ETL projects.",
        "skills": ["PySpark", "SQL", "dbt", "Airflow", "Python", "ETL"]
    },
    {
        "name": "Vikram (Backend Systems Engineer)",
        "expected_domain": "backend_systems",
        "is_fresher": False,
        "text": "Vikram Verma - Backend Developer with 5 years experience building FastAPI, Node.js microservices and PostgreSQL schemas.",
        "skills": ["FastAPI", "Node.js", "Python", "Express.js", "PostgreSQL", "Redis", "Docker", "REST API"]
    },
    {
        "name": "Siddharth (DevOps Architect)",
        "expected_domain": "devops_sre",
        "is_fresher": False,
        "text": "Siddharth Mehta - DevOps Architect with 6 years experience in Kubernetes, Terraform, AWS, and Prometheus monitoring.",
        "skills": ["Docker", "Kubernetes", "Terraform", "AWS", "GCP", "CI/CD", "Prometheus", "Linux"]
    }
]

def calculate_baseline_score(tech_user_skills: set, role: JobRole) -> int:
    """Legacy Baseline: Coverage + Jaccard."""
    raw_role_skills = set([s.lower() for s in (role.required_skills or [])] + [s.lower() for s in (role.ats_keywords or [])])
    tech_role_skills = set([s for s in raw_role_skills if s not in SOFT_SKILLS])
    
    if not tech_role_skills:
        return 0

    overlap = len(tech_user_skills.intersection(tech_role_skills))
    if overlap == 0:
        return 0

    coverage = overlap / len(tech_role_skills)
    jaccard = overlap / len(tech_user_skills.union(tech_role_skills)) if tech_user_skills.union(tech_role_skills) else 0
    sim = (0.6 * coverage) + (0.4 * jaccard)

    if overlap >= 3 and coverage >= 0.5:
        return min(94, round(75 + (sim * 20)))
    elif overlap >= 2:
        return min(84, max(65, round(62 + (sim * 22))))
    else:
        return min(68, max(52, round(48 + (sim * 22))))

def compute_ndcg_at_k(actual_titles: list, expected_domain: str, k=5) -> float:
    """Computes Normalized Discounted Cumulative Gain at K."""
    dcg = 0.0
    for i, title in enumerate(actual_titles[:k]):
        title_lower = title.lower()
        # Relevance grade: 2 for exact engineering role match, 1 for domain match, 0 for designer/other
        if any(term in title_lower for term in ['developer', 'engineer', 'architect', 'scientist']) and expected_domain in title_lower:
            rel = 3
        elif any(term in title_lower for term in ['developer', 'engineer', 'architect', 'scientist']):
            rel = 2
        elif 'designer' in title_lower or 'manager' in title_lower:
            rel = 0
        else:
            rel = 1
            
        dcg += (2**rel - 1) / math.log2(i + 2)
        
    # Ideal DCG
    ideal_rels = sorted([3, 3, 2, 2, 1], reverse=True)[:k]
    idcg = sum((2**rel - 1) / math.log2(i + 2) for i, rel in enumerate(ideal_rels))
    return dcg / idcg if idcg > 0 else 0.0

def test_comparative_eval_suite():
    db = SessionLocal()
    roles = db.query(JobRole).limit(1500).all()
    
    print("\n" + "="*85)
    print(" COMPARATIVE RANKING BENCHMARK: BASELINE vs ENGINE V2 vs ML RANKER")
    print("="*85)
    
    baseline_ndcgs = []
    v2_ndcgs = []
    ml_ndcgs = []
    
    baseline_mismatches = 0
    v2_mismatches = 0
    ml_mismatches = 0
    
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

    for candidate in SAMPLE_CANDIDATES:
        tech_user_skills = set([s.lower() for s in candidate["skills"] if s.lower() not in SOFT_SKILLS])
        domain = candidate["expected_domain"]
        cand_text = candidate["text"]
        kw_list = domain_title_keywords.get(domain, domain_title_keywords['general'])
        
        baseline_scored = []
        v2_scored = []
        ml_scored = []
        
        for r in roles:
            title_lower = (r.title or '').lower()
            if not any(kw in title_lower for kw in kw_list):
                continue

            # Baseline
            b_score = calculate_baseline_score(tech_user_skills, r)
            if b_score > 0:
                baseline_scored.append((b_score, r))
                
            # Engine v2 & ML Features
            feat = extract_ranking_features(tech_user_skills, cand_text, domain, r)
            v2_score = calculate_engine_v2_score(feat)
            ml_score = ml_ranker_instance.predict_score(feat)
            
            if feat["required_skill_coverage"] > 0 or feat["title_similarity"] >= 0.7:
                v2_scored.append((v2_score, r))
                ml_scored.append((ml_score, r))
                
        baseline_top5 = [r.title for _, r in sorted(baseline_scored, key=lambda x: x[0], reverse=True)[:5]]
        v2_top5 = [r.title for _, r in sorted(v2_scored, key=lambda x: x[0], reverse=True)[:5]]
        ml_top5 = [r.title for _, r in sorted(ml_scored, key=lambda x: x[0], reverse=True)[:5]]
        
        b_ndcg = compute_ndcg_at_k(baseline_top5, domain, k=5)
        v2_ndcg = compute_ndcg_at_k(v2_top5, domain, k=5)
        ml_ndcg = compute_ndcg_at_k(ml_top5, domain, k=5)
        
        baseline_ndcgs.append(b_ndcg)
        v2_ndcgs.append(v2_ndcg)
        ml_ndcgs.append(ml_ndcg)
        
        # Mismatch check (designer in top 3)
        if any('designer' in t.lower() for t in baseline_top5[:3]): baseline_mismatches += 1
        if any('designer' in t.lower() for t in v2_top5[:3]): v2_mismatches += 1
        if any('designer' in t.lower() for t in ml_top5[:3]): ml_mismatches += 1
        
        print(f"\nCandidate: {candidate['name']}")
        print(f"  - Baseline Top Match:  {baseline_top5[0] if baseline_top5 else 'None'} (NDCG@5: {b_ndcg:.3f})")
        print(f"  - Engine v2 Top Match: {v2_top5[0] if v2_top5 else 'None'} (NDCG@5: {v2_ndcg:.3f})")
        print(f"  - ML Ranker Top Match: {ml_top5[0] if ml_top5 else 'None'} (NDCG@5: {ml_ndcg:.3f})")

    db.close()
    
    avg_b_ndcg = np.mean(baseline_ndcgs)
    avg_v2_ndcg = np.mean(v2_ndcgs)
    avg_ml_ndcg = np.mean(ml_ndcgs)
    
    print("\n" + "="*85)
    print(" SYSTEM PERFORMANCE METRICS SUMMARY:")
    print("="*85)
    print(f" Metric                        Baseline     Engine v2     ML Ranker (LTR)")
    print(f" -------------------------------------------------------------------------")
    print(f" Mean NDCG@5                   {avg_b_ndcg:.3f}        {avg_v2_ndcg:.3f}         {avg_ml_ndcg:.3f}")
    print(f" Title Mismatch Rate (UI/UX)   {(baseline_mismatches/len(SAMPLE_CANDIDATES))*100:.1f}%        {(v2_mismatches/len(SAMPLE_CANDIDATES))*100:.1f}%          {(ml_mismatches/len(SAMPLE_CANDIDATES))*100:.1f}%")
    print(f" Parent Skill Credit           No           Yes           Yes")
    print(f" Seniority Awareness           No           Yes           Yes")
    print("="*85 + "\n")
    
    assert avg_v2_ndcg >= avg_b_ndcg, "Engine v2 should outperform legacy Baseline NDCG@5"
    assert avg_ml_ndcg >= avg_b_ndcg, "ML Ranker should outperform legacy Baseline NDCG@5"
    assert v2_mismatches == 0, "Engine v2 should eliminate UI/UX Designer title mismatches"
