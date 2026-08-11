import logging
from typing import Dict, Any, List, Optional
from services.ai.job_matching import detect_domain_weighted

logger = logging.getLogger(__name__)

def get_domain_missing_skills(domain: str, user_skills_lower: set) -> List[str]:
    """
    Returns a list of missing skills relevant to the detected domain.
    Only suggests skills the user does NOT already have.
    """
    domain_skill_pool = {
        'frontend': [
            ("TypeScript", "typescript"), ("Next.js", "next.js"), ("Tailwind", "tailwind"),
            ("Redux", "redux"), ("Testing Library", "testing library"), ("Webpack", "webpack"),
            ("Figma", "figma"), ("Sass", "sass"), ("Vite", "vite"), ("Storybook", "storybook"),
            ("GraphQL", "graphql"), ("PWA", "pwa"),
        ],
        'backend_devops': [
            ("Docker", "docker"), ("AWS", "aws"), ("Kubernetes", "kubernetes"),
            ("CI/CD", "ci/cd"), ("Redis", "redis"), ("PostgreSQL", "postgresql"),
            ("Terraform", "terraform"), ("Nginx", "nginx"), ("RabbitMQ", "rabbitmq"),
            ("gRPC", "grpc"), ("Linux", "linux"), ("Monitoring", "monitoring"),
        ],
        'data': [
            ("Spark", "spark"), ("Airflow", "airflow"), ("dbt", "dbt"),
            ("Snowflake", "snowflake"), ("Docker", "docker"), ("AWS", "aws"),
            ("Scikit-learn", "scikit-learn"), ("TensorFlow", "tensorflow"),
            ("Deep Learning", "deep learning"), ("Statistics", "statistics"),
            ("BigQuery", "bigquery"), ("Looker", "looker"),
        ],
        'general': [
            ("Docker", "docker"), ("AWS", "aws"), ("CI/CD", "ci/cd"),
            ("Git", "git"), ("SQL", "sql"), ("Python", "python"),
            ("TypeScript", "typescript"), ("React", "react"),
            ("Linux", "linux"), ("Testing", "testing"),
        ],
    }

    pool = domain_skill_pool.get(domain, domain_skill_pool['general'])
    missing = [display for display, key in pool if key not in user_skills_lower]
    return missing[:5]

def generate_dynamic_improvements(parsed_resume: Dict[str, Any], domain: str) -> List[Dict[str, str]]:
    """
    Generates improvement suggestions by extracting actual bullet points from
    the resume's experience and projects sections, then suggesting rewrites
    with quantified impact and active verbs.
    """
    improvements = []
    
    experience_bullets = []
    for exp_line in parsed_resume.get("experience", []):
        line = exp_line.strip() if isinstance(exp_line, str) else str(exp_line)
        if len(line) > 20 and not any(sep in line for sep in [' at ', ' | ', ' @ ']):
            experience_bullets.append(line)
    
    project_bullets = []
    for proj_line in parsed_resume.get("projects", []):
        line = proj_line.strip() if isinstance(proj_line, str) else str(proj_line)
        if len(line) > 20:
            project_bullets.append(line)
    
    all_bullets = experience_bullets + project_bullets
    skills = parsed_resume.get("skills", [])
    skills_str = ", ".join(skills[:3]) if skills else "relevant technologies"
    
    if all_bullets:
        for bullet in all_bullets[:3]:
            before_text = bullet[:120] + "..." if len(bullet) > 120 else bullet
            
            if any(kw in bullet.lower() for kw in ['built', 'created', 'developed', 'made', 'worked on']):
                after_text = f"Architected and deployed {skills_str}-powered solution, reducing development time by 30% and improving system throughput by 2x."
                reason = "Added measurable impact metrics and specified the exact technologies used."
            elif any(kw in bullet.lower() for kw in ['managed', 'led', 'coordinated', 'organized']):
                after_text = f"Led cross-functional team of 5 members, delivering project 2 weeks ahead of schedule with 98% stakeholder satisfaction."
                reason = "Quantified team size, timeline impact, and stakeholder outcomes."
            elif any(kw in bullet.lower() for kw in ['analyzed', 'research', 'studied', 'investigated']):
                after_text = f"Conducted data-driven analysis using {skills_str}, identifying key insights that drove a 25% improvement in target KPIs."
                reason = "Connected analytical work to measurable business outcomes."
            else:
                after_text = f"Implemented {skills_str}-based solution achieving 40% performance improvement with comprehensive test coverage."
                reason = "Added specific technologies, quantified results, and emphasized engineering quality."
            
            improvements.append({
                "before": before_text,
                "after": after_text,
                "reason": reason
            })
    else:
        domain_improvements = {
            'frontend': [
                {
                    "before": f"Built web pages using {skills_str}.",
                    "after": f"Engineered responsive, accessible {skills_str} components achieving 95+ Lighthouse performance scores and 40% faster page loads.",
                    "reason": "Added Lighthouse metrics, accessibility focus, and quantified performance gains."
                },
                {
                    "before": "Worked on frontend UI features.",
                    "after": f"Designed and implemented reusable component library with {skills_str}, reducing UI development time by 35% across 3 product teams.",
                    "reason": "Specified scale of impact and reusability metrics."
                }
            ],
            'backend_devops': [
                {
                    "before": f"Developed backend APIs using {skills_str}.",
                    "after": f"Designed and deployed RESTful APIs with {skills_str} handling 10K+ concurrent requests with 99.9% uptime SLA.",
                    "reason": "Added scalability metrics, uptime guarantees, and deployment context."
                },
                {
                    "before": "Set up CI/CD pipelines and cloud infrastructure.",
                    "after": f"Architected automated CI/CD pipeline using {skills_str}, reducing deployment time from 45 minutes to 8 minutes with zero-downtime releases.",
                    "reason": "Quantified before/after deployment times and emphasized reliability."
                }
            ],
            'data': [
                {
                    "before": f"Performed data analysis using {skills_str}.",
                    "after": f"Built automated {skills_str} analytics pipeline processing 2M+ records daily, generating executive dashboards that drove 15% revenue growth.",
                    "reason": "Added data volume scale, automation emphasis, and tied analysis to business revenue."
                },
                {
                    "before": "Created dashboards and reports for stakeholders.",
                    "after": f"Designed interactive {skills_str} dashboards with drill-down capabilities, reducing reporting cycle from 5 days to real-time for C-suite stakeholders.",
                    "reason": "Specified dashboard capabilities, quantified time savings, and identified audience."
                }
            ],
            'general': [
                {
                    "before": f"Worked on software projects using {skills_str}.",
                    "after": f"Designed and shipped production-grade features using {skills_str}, improving system performance by 30% and reducing bug reports by 45%.",
                    "reason": "Added production context, quantified performance and quality improvements."
                },
                {
                    "before": "Collaborated with team on project development.",
                    "after": f"Led technical design reviews and mentored 3 junior developers, accelerating sprint velocity by 20% through improved code review processes.",
                    "reason": "Quantified leadership impact and specified mentoring scope."
                }
            ]
        }
        improvements = domain_improvements.get(domain, domain_improvements['general'])
    
    return improvements[:3]

def generate_dynamic_interview_questions(skills: List[str], domain: str, parsed_resume: Dict[str, Any]) -> List[str]:
    """
    Generates interview questions based on actual skills found in the resume and career domain.
    """
    questions = []
    skill_questions = {
        "react": "You listed React as a skill. Can you explain how you manage complex state in a React application — when would you choose Context API vs Redux vs Zustand?",
        "javascript": "Walk us through how JavaScript's event loop works. How does this knowledge help you debug async issues in production?",
        "typescript": "What advantages has TypeScript brought to your projects? Can you share an example of a complex type you've written?",
        "python": "Describe a Python project where performance was critical. What profiling tools did you use and what optimizations did you implement?",
        "sql": "Can you explain the difference between a correlated subquery and a JOIN? When would you use each, and what are the performance implications?",
        "docker": "Walk us through your Docker workflow. How do you optimize Docker images for production deployments?",
        "aws": "Which AWS services have you used, and how did you architect a solution to be cost-effective and highly available?",
        "kubernetes": "Explain how you would set up a Kubernetes deployment for a microservice that needs auto-scaling. What metrics would you use?",
        "machine learning": "Describe your approach to feature engineering. How do you handle imbalanced datasets in classification problems?",
        "pandas": "How do you handle large datasets that don't fit in memory when working with Pandas? What optimization techniques do you use?",
        "fastapi": "What makes FastAPI different from Flask or Django? How do you handle authentication and rate limiting in your FastAPI projects?",
        "git": "Describe your Git branching strategy. How do you handle merge conflicts in a team environment?",
        "html": "How do you ensure web accessibility (WCAG compliance) in your HTML markup? Give specific examples.",
        "css": "Explain your approach to responsive design. How do you decide between Flexbox and Grid for layouts?",
        "vue": "How does Vue's reactivity system work under the hood? When would you choose Vue over React?",
        "angular": "Explain Angular's dependency injection system. How does it help with testing and modularity?",
        "node.js": "How do you handle memory leaks in Node.js applications? What monitoring tools do you use?",
        "django": "Explain Django's ORM query optimization techniques. How do you avoid N+1 query problems?",
        "flask": "How do you structure a large Flask application? What patterns do you use for configuration management?",
        "power bi": "How do you design a Power BI data model for complex reporting needs? Explain star schema vs snowflake schema.",
        "tableau": "Describe how you optimized a Tableau dashboard for performance. What LOD expressions have you used?",
        "tensorflow": "Walk us through your model training pipeline. How do you handle hyperparameter tuning and model versioning?",
        "pytorch": "Compare PyTorch's dynamic computation graph with TensorFlow's approach. When do you prefer one over the other?",
        "ci/cd": "Describe your ideal CI/CD pipeline setup. How do you handle automated testing, staging, and rollback strategies?",
        "excel": "How do you handle complex data transformations in Excel? When would you recommend switching to Python/SQL instead?",
        "spark": "Explain the difference between RDD, DataFrame, and Dataset in Spark. How do you optimize Spark jobs for large-scale data?",
        "next.js": "How does Next.js handle server-side rendering vs static generation? When would you use each approach?",
        "tailwind": "How do you maintain consistency in a Tailwind CSS project? Do you use a design token system?",
        "mongodb": "When would you choose MongoDB over a relational database? How do you handle schema migrations?",
        "postgresql": "Explain PostgreSQL indexing strategies. When would you use B-tree vs GIN vs GiST indexes?",
        "redis": "How do you use Redis in your applications — caching, session storage, or message broker? Explain your eviction strategy.",
    }
    
    for skill in skills:
        skill_key = skill.lower()
        if skill_key in skill_questions:
            questions.append(skill_questions[skill_key])
        if len(questions) >= 3:
            break
    
    domain_behavioral = {
        'frontend': [
            "A client reports that your web app loads slowly on mobile. Walk us through your debugging and optimization process.",
            "How do you approach building an accessible, responsive design that works across different screen sizes and devices?",
        ],
        'backend_devops': [
            "Your API is experiencing intermittent 500 errors under high load. How do you diagnose and resolve this?",
            "Describe how you would design a system to handle 100x traffic spikes during peak events.",
        ],
        'data': [
            "You discover that your data pipeline has been producing incorrect results for the past week. How do you handle this?",
            "A stakeholder asks you to prove that a new feature increased user engagement. Walk us through your analytical approach.",
        ],
        'general': [
            "Tell us about a technically challenging project you worked on. What was the hardest problem and how did you solve it?",
            "How do you decide which technologies to use for a new project? Walk us through your decision-making process.",
        ],
    }
    
    behavioral = domain_behavioral.get(domain, domain_behavioral['general'])
    for q in behavioral:
        if len(questions) < 5:
            questions.append(q)
    
    projects = parsed_resume.get("projects", [])
    if projects and len(questions) < 5:
        project_name = projects[0] if isinstance(projects[0], str) else str(projects[0])
        if len(project_name) > 5:
            questions.append(f"Tell us more about your project: '{project_name[:60]}'. What was the most challenging technical decision you made?")
    
    return questions[:5]

def analyze_resume_with_heuristics(parsed_resume: Dict[str, Any], job_description: Optional[str] = None) -> Dict[str, Any]:
    """
    Local dynamic analysis logic that computes resume metrics from the actual parsed resume data.
    """
    skills = parsed_resume.get("skills", [])
    text = parsed_resume.get("text", "")
    
    skills_count = len(skills)
    ats_score = min(60 + (skills_count * 4), 98)
    resume_score = min(58 + (skills_count * 5), 97)
    
    if job_description:
        jd_lower = job_description.lower()
        matches = 0
        for s in skills:
            if s.lower() in jd_lower:
                matches += 1
        ats_score = min(40 + (matches * 15), 98) if skills else 40
    
    education_score = 95 if parsed_resume.get("education") else 0
    experience_score = min(40 + (len(parsed_resume.get("experience", [])) * 5), 95) if parsed_resume.get("experience") else 40
    projects_score = min(50 + (len(parsed_resume.get("projects", [])) * 10), 95) if parsed_resume.get("projects") else 40
    skills_score = min(40 + (skills_count * 6), 98)
    
    links = parsed_resume.get("links", {})
    formatting_penalty = 0
    if not links.get("github"):
        formatting_penalty += 5
    if not links.get("linkedin"):
        formatting_penalty += 5
    formatting_score = 100 - formatting_penalty
    
    grammar_score = 94 if len(text) > 100 else 50
    keyword_match_percentage = min(50 + (skills_count * 5), 95)
    keyword_missing_percentage = 100 - keyword_match_percentage
    
    skills_lower = [s.lower() for s in skills]
    domain = detect_domain_weighted(skills_lower)
    
    user_skills_lower = set(skills_lower)
    missing_skills = get_domain_missing_skills(domain, user_skills_lower)
    
    suggestions = []
    if len(parsed_resume.get("experience", [])) < 3:
        suggestions.append("Add measurable achievements with exact impact metrics (e.g. 'Improved performance by 35%').")
    if not links.get("github"):
        suggestions.append("Include a link to your GitHub portfolio for project validation.")
    if missing_skills:
        top_missing = ", ".join(missing_skills[:3])
        suggestions.append(f"Consider learning {top_missing} — these are in-demand skills for your target domain.")
    if not parsed_resume.get("education"):
        suggestions.append("Ensure your Education section explicitly lists your degree, university, and graduation year.")
    if len(skills) < 5:
        suggestions.append("List more technical skill keywords matching target job descriptions.")
        
    if len(suggestions) < 3:
        domain_tips = {
            'frontend': [
                "Tailor your professional summary to emphasize modern frontend framework expertise (React/Vue/Angular).",
                "Detail web performance optimization or client-side rendering improvements to expand proof of work."
            ],
            'backend_devops': [
                "Tailor your professional summary to emphasize API scaling and infrastructure automation.",
                "Detail cloud hosting or deployment pipeline automations to expand proof of work."
            ],
            'data': [
                "Tailor your professional summary to emphasize statistical analyses and data pipeline expertise.",
                "Detail BI dashboarding or large-scale data processing projects to expand proof of work."
            ],
            'general': [
                "Tailor your professional summary to emphasize software design principles and clean architecture.",
                "Detail target application development or system designs to expand proof of work."
            ],
        }
        suggestions.extend(domain_tips.get(domain, domain_tips['general']))
            
    if domain == 'frontend':
        roadmap = [
            {"title": "Student", "completed": True, "desc": "HTML, CSS, JS foundations & clean UI layouts"},
            {"title": "Junior Frontend Dev", "completed": True, "desc": "Modern JS/TS, UI components & basic SPA state management"},
            {"title": "Frontend Engineer", "completed": ats_score >= 70, "desc": "React/Vue/Angular development, state stores & styling frameworks"},
            {"title": "Senior Frontend Engineer", "completed": False, "desc": "Web performance tuning, bundle optimization, security & caching patterns"},
            {"title": "Frontend Architect", "completed": False, "desc": "Design systems creation, micro-frontends architecture & build tooling configs"},
            {"title": "VP of Engineering", "completed": False, "desc": "Technical leadership, department alignment, hiring & CTO pathway"}
        ]
    elif domain == 'backend_devops':
        roadmap = [
            {"title": "Student", "completed": True, "desc": "Basic CLI scripts, HTTP requests & simple server building"},
            {"title": "Junior Backend Dev", "completed": True, "desc": "APIs endpoints writing, basic SQL database queries & git controls"},
            {"title": "Backend Engineer", "completed": ats_score >= 70, "desc": "FastAPI/Node microservices, indexing, ORMs & auth systems implementation"},
            {"title": "Senior Backend Engineer", "completed": False, "desc": "Distributed systems, queues, caching stores (Redis) & architecture designs"},
            {"title": "Cloud / DevOps Lead", "completed": False, "desc": "Kubernetes setups, CI/CD automation pipelines & high-availability hosting"},
            {"title": "VP of Technology / CTO", "completed": False, "desc": "Strategic technology decisions, scalability oversight & leadership"}
        ]
    elif domain == 'data':
        roadmap = [
            {"title": "Student", "completed": True, "desc": "Foundational Python, SQL basics & spreadsheets statistics"},
            {"title": "Junior Analyst", "completed": True, "desc": "Data wrangling, SQL joins, basic reports & dashboards"},
            {"title": "Data Analyst", "completed": ats_score >= 70, "desc": "Advanced SQL, BI tools (Power BI), KPIs & statistical evaluations"},
            {"title": "Senior Analyst", "completed": False, "desc": "Predictive analytics models, warehouse modeling (dbt) & business insights"},
            {"title": "Analytics Engineer", "completed": False, "desc": "ELT pipelines orchestrations, warehouse optimization & modeling standards"},
            {"title": "AI Engineer / Data Scientist", "completed": False, "desc": "Machine Learning training, LLM fine-tuning, neural nets & production serving"}
        ]
    else:
        roadmap = [
            {"title": "Student", "completed": True, "desc": "Programming fundamentals, basic algorithms & programming tools"},
            {"title": "Junior Software Eng", "completed": True, "desc": "Writing clean code, debugging, Git operations & task completions"},
            {"title": "Software Engineer", "completed": ats_score >= 70, "desc": "Feature development, unit tests, code reviews & design implementation"},
            {"title": "Senior Software Eng", "completed": False, "desc": "System architecture, API design, security patterns & mentoring team"},
            {"title": "Tech Lead / Architect", "completed": False, "desc": "Large-scale systems design, technology stack decisions & technical specs"},
            {"title": "CTO / Director of Eng", "completed": False, "desc": "Strategic roadmap planning, engineering team management & tech vision"}
        ]

    domain_job_templates = {
        'frontend': [
            {"company": "Google", "role": "Frontend Developer", "salary": "₹18–24 LPA", "location": "Bangalore", "logo": "G", "color": "#4285F4", "req_skills": {"react", "javascript", "html", "css", "typescript"}},
            {"company": "Vercel", "role": "React Engineer", "salary": "₹22–28 LPA", "location": "Remote", "logo": "V", "color": "#000000", "req_skills": {"react", "next.js", "typescript", "css", "javascript"}},
            {"company": "Meta", "role": "UI Engineer", "salary": "₹20–26 LPA", "location": "Hyderabad", "logo": "M", "color": "#1877F2", "req_skills": {"react", "javascript", "css", "html", "graphql"}},
            {"company": "Flipkart", "role": "Frontend Engineer", "salary": "₹16–22 LPA", "location": "Bangalore", "logo": "F", "color": "#2874F0", "req_skills": {"react", "javascript", "html", "css", "redux"}},
        ],
        'backend_devops': [
            {"company": "AWS", "role": "Backend Cloud Engineer", "salary": "₹20–26 LPA", "location": "Bangalore", "logo": "A", "color": "#FF9900", "req_skills": {"python", "aws", "docker", "sql", "linux"}},
            {"company": "Stripe", "role": "API Integration Engineer", "salary": "₹24–30 LPA", "location": "Bangalore", "logo": "S", "color": "#635BFF", "req_skills": {"python", "fastapi", "sql", "docker", "redis"}},
            {"company": "Microsoft", "role": "DevOps Engineer I", "salary": "₹20–26 LPA", "location": "Hyderabad", "logo": "M", "color": "#F25022", "req_skills": {"docker", "kubernetes", "ci/cd", "aws", "terraform"}},
            {"company": "Razorpay", "role": "Backend Engineer", "salary": "₹18–24 LPA", "location": "Bangalore", "logo": "R", "color": "#3395FF", "req_skills": {"python", "node.js", "sql", "docker", "redis"}},
        ],
        'data': [
            {"company": "Tiger Analytics", "role": "Senior Data Scientist (GenAI & RAG)", "salary": "₹22–32 LPA", "location": "Bangalore", "logo": "T", "color": "#00A88F", "req_skills": {"python", "sql", "pytorch", "rag", "agentic ai", "llms", "pyspark", "deep learning", "machine learning"}},
            {"company": "Google", "role": "Staff Data Scientist / ML Engineer", "salary": "₹28–38 LPA", "location": "Bangalore", "logo": "G", "color": "#4285F4", "req_skills": {"python", "sql", "tensorflow", "pytorch", "scikit-learn", "statistics", "machine learning"}},
            {"company": "Microsoft", "role": "GenAI Systems Engineer", "salary": "₹25–35 LPA", "location": "Hyderabad", "logo": "M", "color": "#F25022", "req_skills": {"python", "sql", "spark", "aws", "airflow", "llms", "langchain"}},
            {"company": "Amazon", "role": "Senior Applied Scientist (NLP & LLMs)", "salary": "₹30–42 LPA", "location": "Chennai", "logo": "A", "color": "#FF9900", "req_skills": {"python", "sql", "nlp", "deep learning", "pytorch", "transformers"}},
            {"company": "Swiggy", "role": "Lead Data Scientist", "salary": "₹24–34 LPA", "location": "Bangalore", "logo": "S", "color": "#FC8019", "req_skills": {"python", "sql", "pandas", "scikit-learn", "machine learning", "analytics"}},
        ],
        'general': [
            {"company": "Google", "role": "Software Engineer I", "salary": "₹18–25 LPA", "location": "Bangalore", "logo": "G", "color": "#4285F4", "req_skills": {"python", "java", "sql", "git", "algorithms"}},
            {"company": "Microsoft", "role": "Software Engineer I", "salary": "₹20–26 LPA", "location": "Hyderabad", "logo": "M", "color": "#F25022", "req_skills": {"python", "c++", "sql", "git", "algorithms"}},
            {"company": "Apple", "role": "Applications Engineer", "salary": "₹22–28 LPA", "location": "Hyderabad", "logo": "A", "color": "#555555", "req_skills": {"python", "javascript", "sql", "git", "docker"}},
            {"company": "Cognizant", "role": "Programmer Analyst", "salary": "₹8–12 LPA", "location": "Pune", "logo": "C", "color": "#003366", "req_skills": {"python", "java", "sql", "html", "css"}},
        ],
    }
    
    templates = domain_job_templates.get(domain, domain_job_templates['general'])
    job_matches = []
    for tmpl in templates:
        overlap = len(user_skills_lower.intersection(tmpl["req_skills"]))
        total = len(tmpl["req_skills"])
        base_match = int((overlap / total) * 100) if total > 0 else 0
        match_score = min(int(base_match * 0.6 + 40), 99) if overlap > 0 else max(30, min(int(skills_count * 5 + 25), 60))
        
        job_matches.append({
            "company": tmpl["company"],
            "role": tmpl["role"],
            "match": match_score,
            "salary": tmpl["salary"],
            "location": tmpl["location"],
            "logo": tmpl["logo"],
            "color": tmpl["color"],
        })
    
    job_matches.sort(key=lambda x: x["match"], reverse=True)
    improvements = generate_dynamic_improvements(parsed_resume, domain)
    interview_questions = generate_dynamic_interview_questions(skills, domain, parsed_resume)

    return {
        "atsScore": ats_score,
        "resumeScore": resume_score,
        "formatting": formatting_score,
        "grammar": grammar_score,
        "keywords": keyword_match_percentage,
        "skillsFound": skills,
        "missingSkills": missing_skills,
        "suggestions": suggestions,
        "improvements": improvements,
        "interviewQuestions": interview_questions,
        "sectionScores": {
            "Education": education_score,
            "Experience": experience_score,
            "Projects": projects_score,
            "Skills": skills_score,
            "Summary": 65 if "summary" in text.lower() else 35,
            "Certifications": 85 if parsed_resume.get("certifications") else 40
        },
        "keywordMatch": {
            "matched": keyword_match_percentage,
            "missing": keyword_missing_percentage,
            "density": f"{min(2.0 + (skills_count * 0.3), 6.5):.1f}%"
        },
        "roadmap": roadmap,
        "jobMatches": job_matches,
        "historyData": [
            {"label": "Scan 1", "score": max(50, ats_score - 15)},
            {"label": "Scan 2", "score": max(60, ats_score - 8)},
            {"label": "Scan 3", "score": ats_score}
        ]
    }
