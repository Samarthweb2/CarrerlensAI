import pytest
import sys, os
import json
import math
import numpy as np

sys.path.insert(0, os.path.abspath('backend'))

from database.models import JobRole
from services.ai.job_matching import extract_ranking_features, calculate_engine_v2_score, SOFT_SKILLS
from services.ml.ranker import ml_ranker_instance

DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'eval_relevance_dataset.json')

def load_eval_dataset():
    with open(DATASET_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def compute_dcg(relevances: list, k: int) -> float:
    dcg = 0.0
    for i, rel in enumerate(relevances[:k]):
        dcg += (2**rel - 1) / math.log2(i + 2)
    return dcg

def compute_ndcg(relevances: list, k: int) -> float:
    dcg = compute_dcg(relevances, k)
    ideal_rels = sorted(relevances, reverse=True)[:k]
    idcg = compute_dcg(ideal_rels, k)
    return (dcg / idcg) if idcg > 0 else 0.0

def compute_mrr(relevances: list) -> float:
    for i, rel in enumerate(relevances):
        if rel >= 2:
            return 1.0 / (i + 1)
    return 0.0

def compute_precision_at_k(relevances: list, k: int = 5) -> float:
    top_k = relevances[:k]
    relevant_count = sum(1 for rel in top_k if rel >= 2)
    return relevant_count / min(k, len(top_k)) if top_k else 0.0

def mock_job_role(title: str, company: str, domain: str):
    """Creates a mock JobRole instance for feature extraction."""
    req_skills_map = {
        "Senior ReactJS Developer": ["React", "TypeScript", "Next.js", "JavaScript", "HTML5", "CSS3"],
        "Front End Engineer (React/TypeScript)": ["React", "TypeScript", "Redux", "Tailwind CSS"],
        "Full Stack Web Developer (React + Node)": ["React", "Node.js", "PostgreSQL", "JavaScript"],
        "UI / UX Designer": ["Figma", "UI", "React"],
        "Medical Claims Processor": ["Excel", "Medical Billing"],
        "Backend Java Microservices Lead": ["Java", "Spring Boot", "Microservices"],
        "Generative AI Engineer": ["LangChain", "PyTorch", "LLMs", "Python", "RAG"],
        "Senior Machine Learning Research Engineer": ["PyTorch", "Python", "LlamaIndex", "RAG"],
        "Applied AI Scientist": ["PyTorch", "Python", "LangChain", "Deep Learning"],
        "Data Scientist (NLP & LLMs)": ["Python", "NLP", "LLMs", "Scikit-learn"],
        "Blockchain Security Researcher": ["Cryptography", "Python", "Security"],
        "Frontend UI Developer": ["HTML5", "CSS3", "JavaScript"],
        "Junior Data Engineer": ["PySpark", "SQL", "Airflow", "Python"],
        "Entry Level ETL Developer": ["SQL", "ETL", "Python"],
        "Azure Data Engineer": ["PySpark", "SQL", "Azure", "dbt"],
        "Principal Data Architect / VP": ["PySpark", "SQL", "Architecture", "Spark"],
        "Database Administrator (BOCA RATON)": ["SQL", "PostgreSQL", "Database"],
        "QA Automation Lead": ["Cypress", "Playwright", "Selenium"],
        "Backend Engineer (FastAPI/Python)": ["FastAPI", "Python", "PostgreSQL", "Redis"],
        "Senior Node.js Backend Developer": ["Node.js", "Express.js", "Redis", "PostgreSQL"],
        "Fullstack Software Developer": ["Node.js", "React", "PostgreSQL"],
        "Building Engineer / Facilities": ["HVAC", "Maintenance"],
        "Network Engineer Senior": ["Cisco", "Networking", "Python"],
        "UI Designer": ["Figma", "UI"],
        "Cloud DevOps Engineer": ["Docker", "Kubernetes", "Terraform", "AWS"],
        "Site Reliability Engineer (SRE)": ["Kubernetes", "Terraform", "Prometheus", "Linux"],
        "AWS Infrastructure Architect": ["AWS", "Terraform", "Docker"],
        "Linux Systems Administrator": ["Linux", "Bash", "Docker"],
        "Embedded Firmware Developer": ["C", "C++", "RTOS"],
        "Marketing Operations Manager": ["Marketing", "Analytics"]
    }
    
    req = req_skills_map.get(title, ["Software", "Python"])
    
    r = JobRole()
    r.title = title
    r.company = company
    r.required_skills = req
    r.preferred_skills = ["Git", "Docker"]
    r.ats_keywords = req
    return r

def test_rigorous_ranking_evaluation_and_disagreement_analysis():
    dataset = load_eval_dataset()
    candidates = dataset["candidates"]
    
    print("\n" + "="*90)
    print(" RIGOROUS RANKING EVALUATION BENCHMARK: ENGINE V2 (PROD) vs ML RANKER (LTR)")
    print("="*90)
    
    e2_ndcg1, e2_ndcg3, e2_ndcg5, e2_ndcg10, e2_mrrs, e2_p5s = [], [], [], [], [], []
    ml_ndcg1, ml_ndcg3, ml_ndcg5, ml_ndcg10, ml_mrrs, ml_p5s = [], [], [], [], [], []
    
    disagreements = []
    
    for cand in candidates:
        tech_user_skills = set([s.lower() for s in cand["skills"] if s.lower() not in SOFT_SKILLS])
        domain = cand["target_domain"]
        cand_text = cand["text"]
        
        e2_scored = []
        ml_scored = []
        
        for job_data in cand["evaluated_jobs"]:
            job_obj = mock_job_role(job_data["title"], job_data["company"], domain)
            feat = extract_ranking_features(tech_user_skills, cand_text, domain, job_obj)
            
            e2_score = calculate_engine_v2_score(feat)
            ml_score = ml_ranker_instance.predict_score(feat)
            
            rel = job_data["ground_truth_relevance"]
            
            e2_scored.append((e2_score, rel, job_data, feat))
            ml_scored.append((ml_score, rel, job_data, feat))
            
        e2_sorted = sorted(e2_scored, key=lambda x: x[0], reverse=True)
        ml_sorted = sorted(ml_scored, key=lambda x: x[0], reverse=True)
        
        e2_rels = [item[1] for item in e2_sorted]
        ml_rels = [item[1] for item in ml_sorted]
        
        # Calculate Candidate Metrics
        e2_ndcg1.append(compute_ndcg(e2_rels, 1))
        e2_ndcg3.append(compute_ndcg(e2_rels, 3))
        e2_ndcg5.append(compute_ndcg(e2_rels, 5))
        e2_ndcg10.append(compute_ndcg(e2_rels, 10))
        e2_mrrs.append(compute_mrr(e2_rels))
        e2_p5s.append(compute_precision_at_k(e2_rels, 5))
        
        ml_ndcg1.append(compute_ndcg(ml_rels, 1))
        ml_ndcg3.append(compute_ndcg(ml_rels, 3))
        ml_ndcg5.append(compute_ndcg(ml_rels, 5))
        ml_ndcg10.append(compute_ndcg(ml_rels, 10))
        ml_mrrs.append(compute_mrr(ml_rels))
        ml_p5s.append(compute_precision_at_k(ml_rels, 5))
        
        # Check Disagreement (Top-1 Rank Difference)
        e2_top1_title = e2_sorted[0][2]["title"]
        ml_top1_title = ml_sorted[0][2]["title"]
        
        if e2_top1_title != ml_top1_title or e2_rels[0] != ml_rels[0]:
            disagreements.append({
                "candidate": cand["name"],
                "domain": domain,
                "e2_top1": (e2_top1_title, e2_sorted[0][0], e2_sorted[0][1]),
                "ml_top1": (ml_top1_title, ml_sorted[0][0], ml_sorted[0][1]),
                "e2_top_feat": e2_sorted[0][3]
            })

    # Output Metric Summary
    print("\n" + "="*90)
    print(" HOLDOUT EVALUATION METRICS COMPARISON SUMMARY")
    print("="*90)
    print(f" Metric                        Engine v2 (Prod Baseline)     ML Ranker (LTR)")
    print(f" -------------------------------------------------------------------------")
    print(f" NDCG@1                        {np.mean(e2_ndcg1):.4f}                       {np.mean(ml_ndcg1):.4f}")
    print(f" NDCG@3                        {np.mean(e2_ndcg3):.4f}                       {np.mean(ml_ndcg3):.4f}")
    print(f" NDCG@5                        {np.mean(e2_ndcg5):.4f}                       {np.mean(ml_ndcg5):.4f}")
    print(f" NDCG@10                       {np.mean(e2_ndcg10):.4f}                      {np.mean(ml_ndcg10):.4f}")
    print(f" MRR (Mean Reciprocal Rank)    {np.mean(e2_mrrs):.4f}                       {np.mean(ml_mrrs):.4f}")
    print(f" Precision@5                   {np.mean(e2_p5s):.4f}                       {np.mean(ml_p5s):.4f}")
    print("="*90)
    
    # Detailed Disagreement Error Analysis Log
    print("\n" + "="*90)
    print(f" ERROR ANALYSIS LOG: DISAGREEMENTS DETECTED ({len(disagreements)} Candidates)")
    print("="*90)
    if not disagreements:
        print("  [OK] No major Top-1 disagreements detected. Both engines converged on optimal matches.")
    else:
        for idx, d in enumerate(disagreements, 1):
            print(f"\nDisagreement Case #{idx}: Candidate '{d['candidate']}' ({d['domain']})")
            print(f"  - Engine v2 Top #1: '{d['e2_top1'][0]}' | Score: {d['e2_top1'][1]}% | Ground Truth Grade: {d['e2_top1'][2]}/3")
            print(f"  - ML Ranker Top #1: '{d['ml_top1'][0]}' | Score: {d['ml_top1'][1]}% | Ground Truth Grade: {d['ml_top1'][2]}/3")
            print(f"  - Feature Trace (ReqCov={d['e2_top_feat']['required_skill_coverage']:.2f}, TitleSim={d['e2_top_feat']['title_similarity']:.2f}, SeniorityGap={d['e2_top_feat']['seniority_gap']:.2f})")
    print("="*90 + "\n")
    
    assert np.mean(e2_ndcg5) >= 0.85, "Engine v2 production baseline NDCG@5 should be >= 0.85"
    assert np.mean(ml_ndcg5) >= 0.85, "ML Ranker NDCG@5 should be >= 0.85"
    assert np.mean(e2_mrrs) >= 0.90, "Engine v2 production baseline MRR should be >= 0.90"
