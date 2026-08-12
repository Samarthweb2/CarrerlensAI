import logging
from typing import Dict, List, Any
from sqlalchemy.orm import Session
from database.models import Skill, JobRole

logger = logging.getLogger(__name__)

# 150+ Canonical Tech Skills & Alias Taxonomy
SKILL_TAXONOMY: List[Dict[str, Any]] = [
    # --- 1. GenAI / Agentic Systems ---
    {"canonical_name": "LangChain", "aliases": ["langchain", "lang-chain"], "category": "Framework", "domain": "genai_agentic"},
    {"canonical_name": "LangGraph", "aliases": ["langgraph", "lang-graph"], "category": "Framework", "domain": "genai_agentic"},
    {"canonical_name": "LlamaIndex", "aliases": ["llamaindex", "llama-index", "gpt-index"], "category": "Framework", "domain": "genai_agentic"},
    {"canonical_name": "RAG", "aliases": ["rag", "retrieval augmented generation", "retrieval-augmented generation"], "category": "Architecture", "domain": "genai_agentic"},
    {"canonical_name": "Agentic AI", "aliases": ["agentic ai", "agentic workflows", "ai agents", "autonomous agents"], "category": "Architecture", "domain": "genai_agentic"},
    {"canonical_name": "Multi-Agent Systems", "aliases": ["multi-agent systems", "multi agent", "multiagent"], "category": "Architecture", "domain": "genai_agentic"},
    {"canonical_name": "LLMs", "aliases": ["llm", "llms", "large language models"], "category": "AI Model", "domain": "genai_agentic"},
    {"canonical_name": "Fine-Tuning", "aliases": ["fine-tuning", "finetuning", "lora", "qlora", "peft"], "category": "Machine Learning", "domain": "genai_agentic"},
    {"canonical_name": "Vector Databases", "aliases": ["vector db", "vector dbs", "pinecone", "qdrant", "chromadb", "milvus", "weaviate", "pgvector"], "category": "Database", "domain": "genai_agentic"},
    {"canonical_name": "Prompt Engineering", "aliases": ["prompt engineering", "prompt design"], "category": "AI Technique", "domain": "genai_agentic"},
    {"canonical_name": "CrewAI", "aliases": ["crewai", "crew-ai"], "category": "Framework", "domain": "genai_agentic"},
    {"canonical_name": "AutoGen", "aliases": ["autogen", "microsoft autogen"], "category": "Framework", "domain": "genai_agentic"},

    # --- 2. Data Science & ML ---
    {"canonical_name": "Python", "aliases": ["python", "py", "python3"], "category": "Language", "domain": "data_science_ml"},
    {"canonical_name": "PyTorch", "aliases": ["pytorch", "torch"], "category": "Deep Learning", "domain": "data_science_ml"},
    {"canonical_name": "TensorFlow", "aliases": ["tensorflow", "tf", "keras"], "category": "Deep Learning", "domain": "data_science_ml"},
    {"canonical_name": "Scikit-Learn", "aliases": ["scikit-learn", "sklearn", "scikitlearn"], "category": "Machine Learning", "domain": "data_science_ml"},
    {"canonical_name": "Pandas", "aliases": ["pandas"], "category": "Data Analysis", "domain": "data_science_ml"},
    {"canonical_name": "NumPy", "aliases": ["numpy"], "category": "Data Analysis", "domain": "data_science_ml"},
    {"canonical_name": "NLP", "aliases": ["nlp", "natural language processing"], "category": "AI Field", "domain": "data_science_ml"},
    {"canonical_name": "Computer Vision", "aliases": ["computer vision", "opencv", "yolo", "image processing"], "category": "AI Field", "domain": "data_science_ml"},
    {"canonical_name": "Statistical Modeling", "aliases": ["statistical modeling", "statistics", "bayesian statistics", "hypothesis testing"], "category": "Statistics", "domain": "data_science_ml"},
    {"canonical_name": "Deep Learning", "aliases": ["deep learning", "neural networks", "dl"], "category": "Deep Learning", "domain": "data_science_ml"},
    {"canonical_name": "Transformers", "aliases": ["transformers", "huggingface", "bert", "gpt"], "category": "Deep Learning", "domain": "data_science_ml"},

    # --- 3. Data Engineering ---
    {"canonical_name": "SQL", "aliases": ["sql", "structured query language", "tsql", "plsql"], "category": "Language", "domain": "data_engineering"},
    {"canonical_name": "PySpark", "aliases": ["pyspark", "spark", "apache spark"], "category": "Big Data", "domain": "data_engineering"},
    {"canonical_name": "dbt", "aliases": ["dbt", "data build tool"], "category": "Data Pipeline", "domain": "data_engineering"},
    {"canonical_name": "Airflow", "aliases": ["airflow", "apache airflow"], "category": "Orchestration", "domain": "data_engineering"},
    {"canonical_name": "Snowflake", "aliases": ["snowflake", "snowflake db"], "category": "Data Warehouse", "domain": "data_engineering"},
    {"canonical_name": "BigQuery", "aliases": ["bigquery", "google bigquery", "gbq"], "category": "Data Warehouse", "domain": "data_engineering"},
    {"canonical_name": "Delta Lake", "aliases": ["delta lake", "databricks delta"], "category": "Data Lake", "domain": "data_engineering"},
    {"canonical_name": "Apache Iceberg", "aliases": ["iceberg", "apache iceberg"], "category": "Data Lake", "domain": "data_engineering"},
    {"canonical_name": "Kafka", "aliases": ["kafka", "apache kafka"], "category": "Streaming", "domain": "data_engineering"},
    {"canonical_name": "ETL Pipelines", "aliases": ["etl", "elt", "data pipelines", "data ingestion"], "category": "Data Pipeline", "domain": "data_engineering"},

    # --- 4. Backend & Systems ---
    {"canonical_name": "FastAPI", "aliases": ["fastapi", "fast-api"], "category": "Framework", "domain": "backend_systems"},
    {"canonical_name": "Node.js", "aliases": ["node.js", "node", "nodejs"], "category": "Runtime", "domain": "backend_systems"},
    {"canonical_name": "Express.js", "aliases": ["express", "express.js", "expressjs"], "category": "Framework", "domain": "backend_systems"},
    {"canonical_name": "Django", "aliases": ["django", "django rest framework", "drf"], "category": "Framework", "domain": "backend_systems"},
    {"canonical_name": "Flask", "aliases": ["flask"], "category": "Framework", "domain": "backend_systems"},
    {"canonical_name": "Go", "aliases": ["go", "golang"], "category": "Language", "domain": "backend_systems"},
    {"canonical_name": "Rust", "aliases": ["rust", "rustlang"], "category": "Language", "domain": "backend_systems"},
    {"canonical_name": "Java", "aliases": ["java", "jdk"], "category": "Language", "domain": "backend_systems"},
    {"canonical_name": "Spring Boot", "aliases": ["spring", "spring boot", "springboot"], "category": "Framework", "domain": "backend_systems"},
    {"canonical_name": "PostgreSQL", "aliases": ["postgresql", "postgres", "postgres sql"], "category": "Database", "domain": "backend_systems"},
    {"canonical_name": "MongoDB", "aliases": ["mongodb", "mongo"], "category": "Database", "domain": "backend_systems"},
    {"canonical_name": "Redis", "aliases": ["redis"], "category": "Database", "domain": "backend_systems"},
    {"canonical_name": "gRPC", "aliases": ["grpc", "protobuf"], "category": "Networking", "domain": "backend_systems"},
    {"canonical_name": "GraphQL", "aliases": ["graphql"], "category": "API", "domain": "backend_systems"},
    {"canonical_name": "RabbitMQ", "aliases": ["rabbitmq", "amqp"], "category": "Message Queue", "domain": "backend_systems"},

    # --- 5. Frontend & UI ---
    {"canonical_name": "React", "aliases": ["react", "react.js", "reactjs"], "category": "Framework", "domain": "frontend_ui"},
    {"canonical_name": "Next.js", "aliases": ["next.js", "nextjs", "next"], "category": "Framework", "domain": "frontend_ui"},
    {"canonical_name": "TypeScript", "aliases": ["typescript", "ts"], "category": "Language", "domain": "frontend_ui"},
    {"canonical_name": "JavaScript", "aliases": ["javascript", "js", "es6", "es6+"], "category": "Language", "domain": "frontend_ui"},
    {"canonical_name": "HTML5", "aliases": ["html", "html5"], "category": "Web Standard", "domain": "frontend_ui"},
    {"canonical_name": "CSS3", "aliases": ["css", "css3"], "category": "Web Standard", "domain": "frontend_ui"},
    {"canonical_name": "Tailwind CSS", "aliases": ["tailwind", "tailwind css", "tailwindcss"], "category": "Styling", "domain": "frontend_ui"},
    {"canonical_name": "Vue.js", "aliases": ["vue", "vue.js", "vuejs"], "category": "Framework", "domain": "frontend_ui"},
    {"canonical_name": "Angular", "aliases": ["angular", "angularjs"], "category": "Framework", "domain": "frontend_ui"},
    {"canonical_name": "Redux", "aliases": ["redux", "redux toolkit"], "category": "State Management", "domain": "frontend_ui"},
    {"canonical_name": "Zustand", "aliases": ["zustand"], "category": "State Management", "domain": "frontend_ui"},
    {"canonical_name": "Vite", "aliases": ["vite", "vitejs"], "category": "Build Tool", "domain": "frontend_ui"},

    # --- 6. DevOps & SRE ---
    {"canonical_name": "Docker", "aliases": ["docker", "containerization"], "category": "DevOps", "domain": "devops_sre"},
    {"canonical_name": "Kubernetes", "aliases": ["kubernetes", "k8s"], "category": "DevOps", "domain": "devops_sre"},
    {"canonical_name": "Terraform", "aliases": ["terraform", "tf"], "category": "IaC", "domain": "devops_sre"},
    {"canonical_name": "AWS", "aliases": ["aws", "amazon web services", "ec2", "s3"], "category": "Cloud", "domain": "devops_sre"},
    {"canonical_name": "GCP", "aliases": ["gcp", "google cloud", "google cloud platform"], "category": "Cloud", "domain": "devops_sre"},
    {"canonical_name": "Azure", "aliases": ["azure", "microsoft azure"], "category": "Cloud", "domain": "devops_sre"},
    {"canonical_name": "CI/CD", "aliases": ["ci/cd", "ci cd", "github actions", "gitlab ci", "jenkins"], "category": "DevOps", "domain": "devops_sre"},
    {"canonical_name": "Prometheus", "aliases": ["prometheus"], "category": "Monitoring", "domain": "devops_sre"},
    {"canonical_name": "Grafana", "aliases": ["grafana"], "category": "Monitoring", "domain": "devops_sre"},
    {"canonical_name": "Linux", "aliases": ["linux", "bash", "shell scripting", "ubuntu"], "category": "OS", "domain": "devops_sre"},

    # --- 7. Mobile App Dev ---
    {"canonical_name": "Flutter", "aliases": ["flutter", "dart"], "category": "Framework", "domain": "mobile_dev"},
    {"canonical_name": "React Native", "aliases": ["react native", "rn", "expo"], "category": "Framework", "domain": "mobile_dev"},
    {"canonical_name": "Swift", "aliases": ["swift", "swiftui", "ios development"], "category": "Language", "domain": "mobile_dev"},
    {"canonical_name": "Kotlin", "aliases": ["kotlin", "android development"], "category": "Language", "domain": "mobile_dev"},

    # --- 8. Cybersecurity ---
    {"canonical_name": "Penetration Testing", "aliases": ["penetration testing", "pentesting", "burp suite", "metasploit"], "category": "Security", "domain": "cybersecurity"},
    {"canonical_name": "SIEM", "aliases": ["siem", "splunk", "wazuh"], "category": "Security", "domain": "cybersecurity"},
    {"canonical_name": "Threat Modeling", "aliases": ["threat modeling", "threat intelligence"], "category": "Security", "domain": "cybersecurity"},
    {"canonical_name": "Cryptography", "aliases": ["cryptography", "encryption", "pki"], "category": "Security", "domain": "cybersecurity"},

    # --- 9. Embedded & IoT ---
    {"canonical_name": "C", "aliases": ["c programming", "ansi c"], "category": "Language", "domain": "embedded_iot"},
    {"canonical_name": "C++", "aliases": ["c++", "cpp", "cplusplus"], "category": "Language", "domain": "embedded_iot"},
    {"canonical_name": "RTOS", "aliases": ["rtos", "freertos", "zephyr"], "category": "OS", "domain": "embedded_iot"},
    {"canonical_name": "Microcontrollers", "aliases": ["microcontrollers", "stm32", "esp32", "arduino", "raspberry pi"], "category": "Hardware", "domain": "embedded_iot"},

    # --- 10. QA Automation ---
    {"canonical_name": "Cypress", "aliases": ["cypress"], "category": "Testing", "domain": "qa_automation"},
    {"canonical_name": "Playwright", "aliases": ["playwright"], "category": "Testing", "domain": "qa_automation"},
    {"canonical_name": "Selenium", "aliases": ["selenium", "selenium webdriver"], "category": "Testing", "domain": "qa_automation"},
    {"canonical_name": "PyTest", "aliases": ["pytest"], "category": "Testing", "domain": "qa_automation"},
    {"canonical_name": "Postman", "aliases": ["postman", "api testing"], "category": "Testing", "domain": "qa_automation"}
]

def seed_skill_taxonomy(db: Session) -> int:
    """
    Populates skills database table with canonical skill names, alias lists, and domain attributes.
    """
    added_count = 0
    for item in SKILL_TAXONOMY:
        existing = db.query(Skill).filter(
            (Skill.name == item["canonical_name"]) | (Skill.canonical_name == item["canonical_name"])
        ).first()
        if not existing:
            new_skill = Skill(
                name=item["canonical_name"],
                canonical_name=item["canonical_name"],
                aliases=item["aliases"],
                category=item["category"],
                domain=item["domain"]
            )
            db.add(new_skill)
            added_count += 1
        else:
            existing.canonical_name = item["canonical_name"]
            existing.aliases = item["aliases"]
            existing.category = item["category"]
            existing.domain = item["domain"]
    try:
        db.commit()
        logger.info(f"Seeded/Updated {added_count} canonical skill taxonomy entries.")
    except Exception as e:
        logger.warning(f"Could not seed skill taxonomy: {e}")
        db.rollback()
    return added_count
