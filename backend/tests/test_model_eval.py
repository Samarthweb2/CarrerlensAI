import pytest
from resume_parser import extract_skills_keywords
from services.ai.job_matching import detect_candidate_domain
from services.ai.heuristics import generate_personalized_career_roadmap

def test_canonical_skill_alias_extraction():
    sample_text = """
    Proficient in postgres, lang-chain, k8s, ts, pyspark, and docker.
    Experienced in building RAG pipelines and deploying microservices.
    """
    skills = extract_skills_keywords(sample_text)
    
    assert "PostgreSQL" in skills
    assert "LangChain" in skills
    assert "Kubernetes" in skills
    assert "TypeScript" in skills
    assert "PySpark" in skills
    assert "Docker" in skills

def test_11_domain_classification_precision():
    test_vectors = [
        ("genai_agentic", "Experienced with LangChain, LangGraph, LlamaIndex, RAG, Agentic AI, Vector Databases, and PyTorch."),
        ("data_engineering", "Built PySpark ETL pipelines with SQL, Airflow DAGs, Snowflake data warehousing, and dbt."),
        ("data_science_ml", "Data Scientist skilled in Python, Scikit-learn, TensorFlow, PyTorch, Statistical Modeling, and NLP."),
        ("backend_systems", "Backend engineer developing FastAPI microservices in Python, Go, PostgreSQL, Redis, and gRPC."),
        ("frontend_ui", "Frontend React developer proficient in TypeScript, Next.js, HTML5, CSS3, Tailwind CSS, and Redux."),
        ("devops_sre", "DevOps engineer managing Kubernetes clusters, Docker containers, Terraform IaC, AWS, and Prometheus monitoring."),
        ("mobile_dev", "Mobile app developer building Flutter and React Native cross-platform apps in Swift and Kotlin."),
        ("cybersecurity", "Security specialist experienced in Penetration Testing, SIEM Splunk, Threat Modeling, and Cryptography."),
        ("embedded_iot", "Embedded systems developer programming C, C++, RTOS, STM32 microcontrollers, and IoT protocols."),
        ("qa_automation", "QA Automation Engineer writing Cypress, Playwright, Selenium, and PyTest test suites.")
    ]
    
    for expected_domain, text in test_vectors:
        skills = extract_skills_keywords(text)
        skills_set = set([s.lower() for s in skills])
        detected = detect_candidate_domain(skills_set)
        assert detected == expected_domain, f"Expected {expected_domain}, but got {detected} for text: {text[:50]}"

def test_11_domain_career_roadmap_generation():
    domains = [
        'genai_agentic', 'data_engineering', 'data_science_ml', 'backend_systems',
        'frontend_ui', 'fullstack', 'devops_sre', 'mobile_dev', 'cybersecurity',
        'embedded_iot', 'qa_automation'
    ]
    
    for domain in domains:
        parsed = {"skills": ["Python", "SQL"], "text": "Developer", "experience": ["Software Developer"]}
        roadmap = generate_personalized_career_roadmap(parsed, domain, 75)
        assert isinstance(roadmap, list)
        assert len(roadmap) == 6
        assert any(step["completed"] for step in roadmap)
