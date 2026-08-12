"""
CareerLensAI — roadmap.sh Taxonomy Registry
============================================
Central registry of 30+ tech and non-tech career roadmaps aligned with roadmap.sh dataset.
Maps candidate skills and profile context to official roadmap.sh paths, keyword sets,
and 6-step career ladders.
"""

from typing import Dict, Any, List, Set, Optional

ROADMAP_SH_TAXONOMY: Dict[str, Dict[str, Any]] = {
    # =========================================================================
    # AI & DATA DOMAINS
    # =========================================================================
    "ai_data_scientist": {
        "title": "AI & Data Scientist",
        "category": "AI & Data",
        "url": "https://roadmap.sh/ai-data-scientist",
        "keywords": {"python", "sql", "pandas", "numpy", "scikit-learn", "data science", "data scientist", "machine learning", "statistics", "statistical modeling", "exploratory data analysis", "jupyter"},
        "milestones": [
            {"title": "Junior Data Analyst / Engineer", "desc": "Python, SQL, Pandas, NumPy, data wrangling & exploratory analysis"},
            {"title": "Data Scientist", "desc": "Production ML models, Scikit-Learn, statistical modeling & feature engineering"},
            {"title": "Senior Data Scientist", "desc": "Deep Learning with PyTorch/TensorFlow, NLP pipelines & advanced analytics"},
            {"title": "ML Engineer / Applied AI", "desc": "End-to-end ML systems, model serving (MLflow/BentoML), experiment tracking & MLOps"},
            {"title": "ML / AI Architect", "desc": "Distributed training, foundation model design, scalable inference & AI governance"},
            {"title": "VP of AI & Data Science", "desc": "Strategic AI roadmap, enterprise AI strategy & department leadership"}
        ]
    },
    "ai_engineer": {
        "title": "AI Engineer",
        "category": "AI & Data",
        "url": "https://roadmap.sh/ai-engineer",
        "keywords": {"langchain", "langgraph", "llamaindex", "rag", "agentic ai", "multi-agent systems", "llm", "llms", "prompt engineering", "crewai", "autogen", "vector databases", "pinecone", "qdrant", "fine-tuning", "vllm", "ai engineer"},
        "milestones": [
            {"title": "AI & Python Foundations", "desc": "Python, SQL, PyTorch basics, Git & REST API integrations"},
            {"title": "Applied ML & Deep Learning Eng", "desc": "Transformers, HuggingFace, Scikit-learn & model evaluation metrics"},
            {"title": "GenAI & RAG Specialist", "desc": "RAG architectures, Vector DBs (Qdrant/Pinecone), LangChain & LlamaIndex"},
            {"title": "Agentic Systems Architect", "desc": "LangGraph multi-agent orchestration, tool calling & evaluation benchmarks"},
            {"title": "Senior LLMOps / AI Systems Lead", "desc": "Fine-tuning (LoRA/QLoRA), vLLM serving, quantization & distributed inference"},
            {"title": "Principal AI Architect / VP of AI", "desc": "Enterprise GenAI governance, multi-modal AI models & strategic AI roadmap"}
        ]
    },
    "data_engineer": {
        "title": "Data Engineer",
        "category": "AI & Data",
        "url": "https://roadmap.sh/data-engineer",
        "keywords": {"pyspark", "spark", "dbt", "airflow", "snowflake", "bigquery", "delta lake", "apache iceberg", "kafka", "etl pipelines", "etl", "data engineering", "data engineer", "databricks", "hadoop"},
        "milestones": [
            {"title": "SQL & Python Data Foundations", "desc": "Advanced SQL queries, Python scripting, Relational DBs & Linux CLI"},
            {"title": "Junior Data Engineer", "desc": "ETL scripting, Data Warehousing, Data Modeling & Airflow DAGs"},
            {"title": "Data Engineer", "desc": "PySpark distributed computing, dbt transformations, Snowflake & BigQuery"},
            {"title": "Senior Data Engineer", "desc": "Delta Lake, Apache Iceberg, Kafka stream processing & Data Mesh design"},
            {"title": "Big Data & Cloud Architect", "desc": "Real-time streaming infrastructure, cloud data platform governance & SLA optimization"},
            {"title": "Head of Data Infrastructure / CDO", "desc": "Enterprise data strategy, executive leadership & organization data roadmap"}
        ]
    },
    "data_analyst": {
        "title": "Data Analyst",
        "category": "AI & Data",
        "url": "https://roadmap.sh/data-analyst",
        "keywords": {"sql", "tableau", "excel", "power bi", "data analysis", "reporting", "business intelligence", "spreadsheets", "data visualization", "metrics", "kpi"},
        "milestones": [
            {"title": "Excel & SQL Basics", "desc": "Data cleaning, VLOOKUP/XLOOKUP, pivot tables & SQL SELECT queries"},
            {"title": "Junior Data Analyst", "desc": "Intermediate SQL joins/aggregations, Excel modeling & initial dashboard builds"},
            {"title": "Data Analyst", "desc": "Advanced SQL, Power BI / Tableau dashboards, KPI tracking & stakeholder reporting"},
            {"title": "Senior Data Analyst", "desc": "Python/R analytics, statistical testing, cohort analysis & automated reporting pipelines"},
            {"title": "Lead Analytics Consultant", "desc": "Cross-department analytics strategy, data warehousing alignment & executive reporting"},
            {"title": "Head of Analytics", "desc": "Enterprise BI strategy, team leadership & data-driven culture scaling"}
        ]
    },
    "bi_analyst": {
        "title": "BI Analyst",
        "category": "AI & Data",
        "url": "https://roadmap.sh/bi-analyst",
        "keywords": {"power bi", "tableau", "looker", "dax", "ssis", "ssrs", "bi analyst", "business intelligence analyst", "cube", "star schema", "snowflake schema"},
        "milestones": [
            {"title": "Data Warehousing & SQL Basics", "desc": "Relational databases, dimensional modeling, star schema & SQL queries"},
            {"title": "Junior BI Developer", "desc": "Building basic Power BI / Tableau reports, data extraction & simple DAX measures"},
            {"title": "BI Analyst", "desc": "Complex DAX / LOD expressions, automated refresh, enterprise dashboards & data governance"},
            {"title": "Senior BI Engineer", "desc": "Data semantic layer architecture, SSAS/dbt modeling, performance tuning & row-level security"},
            {"title": "BI Architect", "desc": "Enterprise BI platform strategy, data lakehouse integration & self-service BI governance"},
            {"title": "Director of Business Intelligence", "desc": "Organization BI vision, vendor strategy & executive decision support"}
        ]
    },
    "mlops": {
        "title": "MLOps Engineer",
        "category": "AI & Data",
        "url": "https://roadmap.sh/mlops",
        "keywords": {"mlops", "mlflow", "kubeflow", "bentoml", "dvc", "wandb", "model serving", "feature store", "feast", "model monitoring", "evidently"},
        "milestones": [
            {"title": "Python & Software Dev Foundations", "desc": "Clean code, Git, Docker, Python packaging & REST APIs"},
            {"title": "Junior MLOps Engineer", "desc": "CI/CD for ML scripts, MLflow experiment tracking & model registry setups"},
            {"title": "MLOps Engineer", "desc": "Feature stores (Feast), automated re-training pipelines & BentoML/Triton model serving"},
            {"title": "Senior MLOps Architect", "desc": "Kubeflow deployment, GPU cluster scheduling, model drift detection & A/B testing framework"},
            {"title": "Principal AI Platform Engineer", "desc": "Enterprise ML platform architecture, cost optimization & zero-downtime model deployments"},
            {"title": "Head of AI Infrastructure", "desc": "Organization MLOps strategy, infrastructure budget & cross-team ML ops leadership"}
        ]
    },

    # =========================================================================
    # SOFTWARE ENGINEERING & WEB DOMAINS
    # =========================================================================
    "frontend": {
        "title": "Frontend Developer",
        "category": "Software Engineering",
        "url": "https://roadmap.sh/frontend",
        "keywords": {"react", "next.js", "typescript", "javascript", "html5", "css3", "tailwind css", "redux", "zustand", "vite", "vue", "angular", "webpack", "frontend", "ui/ux"},
        "milestones": [
            {"title": "Web Foundations", "desc": "HTML5, CSS3, JavaScript ES6+ & responsive UI layouts"},
            {"title": "Junior Frontend Dev", "desc": "Modern JS/TS, React/Vue components & SPA state management"},
            {"title": "Frontend Engineer", "desc": "React/Next.js development, Redux/Zustand state stores & Tailwind CSS"},
            {"title": "Senior Frontend Engineer", "desc": "Web performance optimization, SSR/SSG caching & security standards"},
            {"title": "Frontend Architect", "desc": "Design systems creation, micro-frontends architecture & build tooling"},
            {"title": "VP of Engineering", "desc": "Department alignment, engineering hiring & technical roadmap"}
        ]
    },
    "backend": {
        "title": "Backend Developer",
        "category": "Software Engineering",
        "url": "https://roadmap.sh/backend",
        "keywords": {"fastapi", "node.js", "express.js", "django", "flask", "go", "rust", "java", "spring boot", "postgresql", "mongodb", "redis", "grpc", "graphql", "rabbitmq", "rest api", "microservices", "backend"},
        "milestones": [
            {"title": "Backend Foundations", "desc": "CLI automation, Python/Node/Java basics, HTTP APIs & SQL databases"},
            {"title": "Junior Backend Dev", "desc": "REST API development, database indexing, Git operations & Docker containers"},
            {"title": "Backend Engineer", "desc": "FastAPI/Express microservices, Redis caching, ORMs & auth systems"},
            {"title": "Senior Backend Engineer", "desc": "Distributed systems, message queues (Kafka/RabbitMQ) & gRPC gateways"},
            {"title": "Cloud & Systems Architect", "desc": "Kubernetes clusters, CI/CD automation pipelines & AWS/GCP cloud scaling"},
            {"title": "VP of Technology / CTO", "desc": "Strategic technology stack, infrastructure security & department vision"}
        ]
    },
    "full_stack": {
        "title": "Full Stack Developer",
        "category": "Software Engineering",
        "url": "https://roadmap.sh/full-stack",
        "keywords": {"fullstack", "full stack", "next.js", "fastapi", "react", "node.js", "express.js", "typescript", "postgresql", "mongodb"},
        "milestones": [
            {"title": "Web & Database Foundations", "desc": "HTML/CSS, JavaScript, SQL databases & Git version control"},
            {"title": "Junior Full-Stack Dev", "desc": "React UI components, Node/Python REST APIs & CRUD database operations"},
            {"title": "Full-Stack Engineer", "desc": "Next.js/React frontend + FastAPI/Node backend + PostgreSQL & Docker"},
            {"title": "Senior Full-Stack Architect", "desc": "End-to-end system design, microservices, Caching & Cloud deployments"},
            {"title": "Staff Software Engineer", "desc": "High-scale architecture, cross-team technical leadership & security standards"},
            {"title": "VP of Product Engineering / CTO", "desc": "Product tech roadmap, engineering org leadership & executive alignment"}
        ]
    },
    "software_architect": {
        "title": "Software Architect",
        "category": "Software Engineering",
        "url": "https://roadmap.sh/software-architect",
        "keywords": {"software architect", "system design", "microservices", "event-driven", "domain-driven design", "ddd", "cap theorem", "distributed systems", "load balancing", "caching strategy"},
        "milestones": [
            {"title": "Software Engineering Core", "desc": "Clean code principles, OOP/Functional paradigms & Design Patterns"},
            {"title": "Senior Software Engineer", "desc": "Modular architecture, API contracts, database schema design & testing strategies"},
            {"title": "Lead Engineer / Solution Architect", "desc": "Microservices vs Monolith tradeoffs, Event-Driven design & Caching/Queue strategies"},
            {"title": "Enterprise Software Architect", "desc": "High-availability system design, multi-region failover, SLA/SLO definition & security governance"},
            {"title": "Principal Architect", "desc": "Organization-wide technology standards, cross-system integration & vendor tech evaluation"},
            {"title": "Chief Technology Officer (CTO)", "desc": "Executive tech strategy, engineering budget, innovation roadmap & platform vision"}
        ]
    },

    # =========================================================================
    # INFRASTRUCTURE & DEVOPS DOMAINS
    # =========================================================================
    "devops": {
        "title": "DevOps Engineer",
        "category": "DevOps & Cloud",
        "url": "https://roadmap.sh/devops",
        "keywords": {"docker", "kubernetes", "terraform", "aws", "gcp", "azure", "ci/cd", "prometheus", "grafana", "ansible", "helm", "linux", "devops", "sre"},
        "milestones": [
            {"title": "Systems & Scripting Foundations", "desc": "Linux CLI, Bash/Python scripting, TCP/IP networking & Git"},
            {"title": "Junior DevOps Engineer", "desc": "Docker containerization, CI/CD pipeline automation & cloud CLI tools"},
            {"title": "DevOps / SRE Engineer", "desc": "Kubernetes cluster management, Terraform IaC, AWS/GCP & Helm charts"},
            {"title": "Senior Cloud / SRE Architect", "desc": "Prometheus/Grafana observability, zero-downtime deployments & SLOs"},
            {"title": "Head of Infrastructure & Reliability", "desc": "Multi-region cloud infrastructure, disaster recovery & security compliance"},
            {"title": "VP of Infrastructure / CTO", "desc": "Infrastructure cost optimization, organization DevOps strategy & leadership"}
        ]
    },
    "aws": {
        "title": "AWS Cloud Architect",
        "category": "DevOps & Cloud",
        "url": "https://roadmap.sh/aws",
        "keywords": {"aws", "ec2", "s3", "rds", "lambda", "ecs", "eks", "cloudformation", "iam", "route53", "cloudfront", "vpc", "aws architect"},
        "milestones": [
            {"title": "Cloud & Linux Core", "desc": "Linux administration, networking fundamentals, HTTP/DNS & Cloud computing concepts"},
            {"title": "AWS Cloud Practitioner", "desc": "IAM permissions, EC2 instances, S3 storage buckets & basic VPC networking"},
            {"title": "AWS Solutions Architect (Associate)", "desc": "Serverless architectures (Lambda/DynamoDB), RDS databases, ECS/EKS & CloudFront CDN"},
            {"title": "Senior AWS Solutions Architect (Professional)", "desc": "Multi-account AWS Landing Zones, Infrastructure-as-Code (Terraform/CDK) & Auto-Scaling"},
            {"title": "Principal Cloud Architect", "desc": "Disaster recovery planning, cloud migration strategies, FinOps cost optimization & compliance"},
            {"title": "VP of Cloud Engineering", "desc": "Global multi-cloud vision, enterprise cloud security & cloud organization strategy"}
        ]
    },

    # =========================================================================
    # QUALITY & CYBERSECURITY DOMAINS
    # =========================================================================
    "cyber_security": {
        "title": "Cyber Security Engineer",
        "category": "Security & Quality",
        "url": "https://roadmap.sh/cyber-security",
        "keywords": {"penetration testing", "siem", "threat modeling", "cryptography", "burp suite", "cybersecurity", "cyber security", "wireshark", "owasp", "soc analyst", "ceh"},
        "milestones": [
            {"title": "Security Foundations", "desc": "Networking fundamentals, Linux CLI, TCP/IP & OS security"},
            {"title": "Junior Security Analyst", "desc": "Vulnerability scanning, SIEM monitoring & incident logging"},
            {"title": "Cybersecurity Engineer", "desc": "Penetration testing, threat modeling, IAM & firewall policies"},
            {"title": "Senior Security Architect", "desc": "Cloud security, Zero Trust architecture, cryptography & compliance"},
            {"title": "Head of Information Security", "desc": "Security risk governance, incident response leadership & team management"},
            {"title": "Chief Information Security Officer (CISO)", "desc": "Executive security strategy, enterprise threat defense & regulatory oversight"}
        ]
    },
    "qa": {
        "title": "QA / Test Automation Engineer",
        "category": "Security & Quality",
        "url": "https://roadmap.sh/qa",
        "keywords": {"cypress", "playwright", "selenium", "pytest", "junit", "postman", "qa", "testing", "automation", "test engineering", "sdet"},
        "milestones": [
            {"title": "Testing Foundations", "desc": "Software QA fundamentals, test planning, manual testing & bug tracking"},
            {"title": "Junior Automation Engineer", "desc": "Python/JS test scripting, Selenium/Playwright basics & API testing (Postman)"},
            {"title": "QA Automation Engineer", "desc": "Cypress/Playwright E2E frameworks, PyTest automation & CI pipeline integration"},
            {"title": "Senior Test Architect", "desc": "Performance & load testing (JMeter), visual regression & test infrastructure"},
            {"title": "Head of Quality Engineering", "desc": "Organization quality governance, automation strategy & release management"},
            {"title": "VP of Quality Assurance", "desc": "Executive QA strategy, continuous deployment quality & department leadership"}
        ]
    },

    # =========================================================================
    # MOBILE DEVELOPMENT DOMAINS
    # =========================================================================
    "android": {
        "title": "Android Developer",
        "category": "Mobile Development",
        "url": "https://roadmap.sh/android",
        "keywords": {"android", "kotlin", "java", "jetpack compose", "android studio", "gradle", "room database", "retrofit", "coroutines"},
        "milestones": [
            {"title": "Kotlin & Mobile Foundations", "desc": "Kotlin syntax, OOP principles, data structures & Android Studio IDE"},
            {"title": "Junior Android Dev", "desc": "Activity/Fragment lifecycles, XML/Compose layouts, Retrofit HTTP calls & Room DB"},
            {"title": "Android Engineer", "desc": "Jetpack Compose, MVVM architecture, Kotlin Coroutines/Flow & Dependency Injection (Hilt)"},
            {"title": "Senior Android Engineer", "desc": "Modularization, custom views/animations, offline-first sync & Play Store CI/CD"},
            {"title": "Mobile Architect", "desc": "App performance profiling, security obfuscation (ProGuard/R8) & design system creation"},
            {"title": "VP of Mobile Engineering", "desc": "Mobile team strategy, platform roadmap & mobile tech stack leadership"}
        ]
    },
    "ios": {
        "title": "iOS Developer",
        "category": "Mobile Development",
        "url": "https://roadmap.sh/ios",
        "keywords": {"ios", "swift", "swiftui", "uikit", "xcode", "cocoapods", "spm", "combine", "coredata"},
        "milestones": [
            {"title": "Swift & iOS Core", "desc": "Swift language, Xcode, Optionals, Enums & Delegates pattern"},
            {"title": "Junior iOS Developer", "desc": "UIKit / SwiftUI views, AutoLayout, REST API integration with URLSession & CoreData"},
            {"title": "iOS Engineer", "desc": "SwiftUI architecture, MVVM-C, Async/Await concurrency & Combine framework"},
            {"title": "Senior iOS Engineer", "desc": "Modular architecture (SPM), Unit/UI testing (XCTest), custom animations & TestFlight CI/CD"},
            {"title": "iOS Architect", "desc": "App size optimization, memory leak debugging (Instruments) & security keychains"},
            {"title": "Head of iOS Development", "desc": "Apple ecosystem strategy, team mentorship & mobile product leadership"}
        ]
    },

    # =========================================================================
    # PRODUCT & NON-TECH DOMAINS (PRODUCT, MANAGEMENT, DESIGN, WRITING)
    # =========================================================================
    "product_manager": {
        "title": "Product Manager",
        "category": "Product & Management (Non-Tech)",
        "url": "https://roadmap.sh/product-manager",
        "keywords": {"product management", "product manager", "roadmap", "user research", "wireframing", "jira", "agile", "scrum", "prd", "prioritization", "product analytics", "mixpanel", "amplitude", "a/b testing"},
        "milestones": [
            {"title": "Product & Business Basics", "desc": "Market research, user persona definition, competitive analysis & Agile/Scrum basics"},
            {"title": "Associate Product Manager (APM)", "desc": "Writing User Stories/PRDs, sprint planning, Jira management & wireframing"},
            {"title": "Product Manager", "desc": "Feature roadmap ownership, product analytics (Mixpanel/Amplitude), A/B testing & release management"},
            {"title": "Senior Product Manager", "desc": "Product strategy, GTM alignment, metrics/KPI ownership & cross-functional leadership"},
            {"title": "Group Product Manager / Director", "desc": "Multi-product portfolio management, team hiring & product-market fit expansion"},
            {"title": "Chief Product Officer (CPO)", "desc": "Enterprise product vision, executive company strategy & board alignment"}
        ]
    },
    "ux_design": {
        "title": "UX / Product Designer",
        "category": "Product & Management (Non-Tech)",
        "url": "https://roadmap.sh/ux-design",
        "keywords": {"ux design", "ui design", "figma", "sketch", "user research", "wireframing", "prototyping", "design system", "usability testing", "information architecture", "interaction design", "product design"},
        "milestones": [
            {"title": "Design Principles & Tools", "desc": "Color theory, typography, Figma mastery, grid layouts & design fundamentals"},
            {"title": "Junior UX/UI Designer", "desc": "Wireframing, user flows, low/high-fidelity prototypes & usability test assistance"},
            {"title": "Product Designer", "desc": "End-to-end feature design, Design System maintenance, micro-interactions & developer handoff"},
            {"title": "Senior Product Designer", "desc": "Complex UX flows, design accessibility (WCAG), user interview synthesis & design strategy"},
            {"title": "Lead Design Architect", "desc": "Enterprise Design System architecture, cross-platform design guidelines & team mentorship"},
            {"title": "Head of Design / VP of Experience", "desc": "Design org culture, brand strategy & executive design vision"}
        ]
    },
    "technical_writer": {
        "title": "Technical Writer",
        "category": "Product & Management (Non-Tech)",
        "url": "https://roadmap.sh/technical-writer",
        "keywords": {"technical writer", "technical documentation", "api documentation", "markdown", "swagger", "openapi", "dita", "gitbook", "confluence", "release notes", "user guides"},
        "milestones": [
            {"title": "Writing & Tech Core", "desc": "Clear technical writing style, Markdown, Git basics & developer communication"},
            {"title": "Junior Technical Writer", "desc": "User manuals, API endpoint documentation, release notes & knowledge base articles"},
            {"title": "Technical Writer", "desc": "OpenAPI / Swagger spec editing, code snippet tutorials, developer portals & docs-as-code"},
            {"title": "Senior Technical Writer", "desc": "Docs architecture (Docusaurus/GitBook), style guide creation & cross-team doc governance"},
            {"title": "Lead Information Architect", "desc": "Enterprise documentation strategy, translation/i18n & automated doc testing"},
            {"title": "Director of Technical Communications", "desc": "Developer docs vision, team leadership & customer education strategy"}
        ]
    },
    "engineering_manager": {
        "title": "Engineering Manager",
        "category": "Product & Management (Non-Tech)",
        "url": "https://roadmap.sh/engineering-manager",
        "keywords": {"engineering manager", "em", "tech lead", "people management", "1-on-1s", "performance review", "hiring", "team velocity", "sprint management", "career growth"},
        "milestones": [
            {"title": "Tech Lead / Senior Engineer", "desc": "Architecture ownership, code reviews, technical mentorship & sprint execution"},
            {"title": "Associate Engineering Manager", "desc": "Conducting 1-on-1s, sprint planning, hiring interviews & team execution tracking"},
            {"title": "Engineering Manager", "desc": "People management, career growth frameworks, team velocity & cross-team delivery"},
            {"title": "Senior Engineering Manager", "desc": "Managing multiple engineering squads, budget planning, EM mentorship & org scaling"},
            {"title": "Director of Engineering", "desc": "Department org design, engineering culture, tech strategy execution & director leadership"},
            {"title": "VP of Engineering", "desc": "Executive tech leadership, board reporting, company-wide engineering vision"}
        ]
    },
    "devrel": {
        "title": "Developer Relations (DevRel)",
        "category": "Product & Management (Non-Tech)",
        "url": "https://roadmap.sh/devrel",
        "keywords": {"devrel", "developer relations", "developer advocate", "community manager", "hackathons", "developer evangelist", "tech blogging", "public speaking", "open source community"},
        "milestones": [
            {"title": "Software & Content Core", "desc": "Coding skills, technical blogging, sample app creation & community participation"},
            {"title": "Junior Developer Advocate", "desc": "Writing code tutorials, managing Discord/Slack forums & hosting local meetups"},
            {"title": "Developer Relations Engineer", "desc": "SDK/API feedback loops, conference speaking, hackathon hosting & dev docs improvements"},
            {"title": "Senior Developer Advocate", "desc": "DevRel strategy, Open Source community growth, influencer partnerships & developer metric tracking"},
            {"title": "Head of DevRel", "desc": "Global developer ecosystem vision, developer marketing budget & team leadership"},
            {"title": "VP of Developer Ecosystem", "desc": "Executive developer strategy, platform ecosystem growth & strategic partnerships"}
        ]
    }
}

DEFAULT_ROADMAP_SH = ROADMAP_SH_TAXONOMY["full_stack"]

def get_taxonomy_for_domain(domain_key: str) -> Dict[str, Any]:
    """Helper to return roadmap taxonomy dict for a given domain key."""
    clean_key = (domain_key or "full_stack").lower().strip()
    return ROADMAP_SH_TAXONOMY.get(clean_key, DEFAULT_ROADMAP_SH)
