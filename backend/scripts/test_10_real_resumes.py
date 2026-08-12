import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import SessionLocal
from resume_parser import extract_skills_keywords
from services.ai.job_matching import detect_candidate_domain, match_jobs_from_db
from services.ai.heuristics import generate_personalized_career_roadmap, analyze_resume_with_heuristics

TEST_RESUMES = [
    {
        "type": "1. Data Analyst",
        "text": "Rahul Verma - Senior Data Analyst. 4 years experience in SQL, Tableau, Power BI, Excel, Data Visualization, Data Cleaning, and Python analysis."
    },
    {
        "type": "2. ML/AI Engineer",
        "text": "Aman Singh Parihar - ML & AI Engineer. PyTorch, TensorFlow, Scikit-learn, LangChain, RAG pipelines, Vector DBs, Deep Learning."
    },
    {
        "type": "3. Backend Developer",
        "text": "Vikram Verma - Backend Microservices Developer. 5 years in FastAPI, Node.js, Express.js, PostgreSQL, Redis, Docker, REST APIs, Python."
    },
    {
        "type": "4. Frontend Developer",
        "text": "Priya Patel - Senior Frontend Engineer. 4 years in React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Redux."
    },
    {
        "type": "5. DevOps / SRE",
        "text": "Siddharth Mehta - DevOps Architect. 6 years in Docker, Kubernetes, Terraform, AWS, GCP, CI/CD pipelines, Prometheus, Linux."
    },
    {
        "type": "6. Fresher CSE",
        "text": "Aniket Sharma - Computer Science Student Fresher (2026 Batch). Knowledge of Python, SQL, C++, HTML, CSS, Git, basic Data Structures."
    },
    {
        "type": "7. Full-stack Developer",
        "text": "Ananya Rao - Full Stack Software Developer. React, Next.js, TypeScript, FastAPI, Node.js, Python, PostgreSQL, Docker, Tailwind CSS."
    },
    {
        "type": "8. Non-tech Resume",
        "text": "Sunita Sharma - Senior Sales & Marketing Operations Manager. Lead generation, customer relationship management, CRM, team leadership."
    },
    {
        "type": "9. Weak / Empty Resume",
        "text": "John Doe - Looking for a job. Good hard worker. Contact me at john@example.com."
    },
    {
        "type": "10. Multi-domain Resume",
        "text": "Ketan Joshi - Software Engineer & ML Practitioner. Built React web apps, FastAPI backend microservices, PySpark ETL pipelines, and PyTorch ML models."
    }
]

def test_10_real_resumes():
    db = SessionLocal()
    
    print("\n" + "="*95)
    print(" REAL-WORLD PRODUCTION EVALUATION: 10 DISTINCT RESUME PROFILES")
    print("="*95)

    for idx, item in enumerate(TEST_RESUMES, 1):
        text = item["text"]
        skills = extract_skills_keywords(text)
        skills_lower = set([s.lower() for s in skills])
        domain = detect_candidate_domain(skills_lower)
        
        parsed = {
            "text": text,
            "skills": skills,
            "experience": ["Work Experience"]
        }
        
        job_matches, missing_skills, top_matches_text, _ = match_jobs_from_db(parsed, None, db)
        
        heuristics_res = analyze_resume_with_heuristics(parsed, None, missing_skills=missing_skills)
        roadmap = heuristics_res["roadmap"]
        
        top_match = job_matches[0] if job_matches else None
        
        print(f"\n--- [{item['type']}] ---")
        print(f"  1. Parsing & Skills ({len(skills)}): {skills[:5]}")
        print(f"  2. Detected Domain:   {domain}")
        print(f"  3. Seniority Fit:     {'Fresher/Entry' if 'Fresher' in text or 'Student' in text else 'Experienced'}")
        if top_match:
            sal_clean = str(top_match['salary']).replace('₹', 'INR ')
            print(f"  4. Top Match DB Job:  {top_match['role']} at {top_match['company']} ({top_match['match']}% Match)")
            print(f"  5. Salary & Location: {sal_clean} | {top_match['location']}")
        else:
            print("  4. Top Match DB Job:  None (Handled Gracefully)")
        print(f"  6. Missing Skills:    {missing_skills[:3]}")
        print(f"  7. Dynamic Roadmap:   Stage 1: {roadmap[0]['title']} -> Stage 3: {roadmap[2]['title']}")

    db.close()
    print("\n" + "="*95 + "\n")

if __name__ == '__main__':
    test_10_real_resumes()
