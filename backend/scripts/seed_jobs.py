import os
import sys
import json

# Add the parent directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from database.database import SessionLocal, engine, Base
from database.models import JobRole

# Job dataset
jobs_data = [
    {
        "title": "Frontend Developer",
        "industry": "Software Engineering",
        "experience_level": "Mid",
        "required_skills": ["JavaScript", "React", "HTML5", "CSS3", "Git"],
        "preferred_skills": ["TypeScript", "Next.js", "Redux", "Tailwind CSS", "Jest"],
        "ats_keywords": ["Frontend", "UI", "UX", "Responsive", "React.js", "Web Performance", "DOM"]
    },
    {
        "title": "Backend Developer",
        "industry": "Software Engineering",
        "experience_level": "Mid",
        "required_skills": ["Python", "Java", "Node.js", "SQL", "REST APIs"],
        "preferred_skills": ["Docker", "Kubernetes", "AWS", "GraphQL", "Redis", "Microservices"],
        "ats_keywords": ["Backend", "API", "Database", "Scalability", "System Design", "Cloud"]
    },
    {
        "title": "Full Stack Developer",
        "industry": "Software Engineering",
        "experience_level": "Mid",
        "required_skills": ["JavaScript", "React", "Node.js", "SQL", "REST APIs"],
        "preferred_skills": ["TypeScript", "Python", "AWS", "Docker", "MongoDB"],
        "ats_keywords": ["Full Stack", "MERN", "MEAN", "End-to-End", "API Design", "Frontend", "Backend"]
    },
    {
        "title": "Data Scientist",
        "industry": "Data",
        "experience_level": "Mid",
        "required_skills": ["Python", "SQL", "Machine Learning", "Pandas", "Scikit-Learn"],
        "preferred_skills": ["TensorFlow", "PyTorch", "Tableau", "Spark", "AWS"],
        "ats_keywords": ["Data Science", "Analytics", "Modeling", "Deep Learning", "Statistics"]
    },
    {
        "title": "DevOps Engineer",
        "industry": "Infrastructure",
        "experience_level": "Mid",
        "required_skills": ["Linux", "Docker", "Kubernetes", "CI/CD", "Bash"],
        "preferred_skills": ["Terraform", "AWS", "Azure", "Ansible", "Python"],
        "ats_keywords": ["DevOps", "Infrastructure as Code", "Deployment", "Monitoring", "Pipelines"]
    },
    {
        "title": "Product Manager",
        "industry": "Product",
        "experience_level": "Mid",
        "required_skills": ["Agile", "Scrum", "Product Roadmap", "Jira", "User Research"],
        "preferred_skills": ["SQL", "Figma", "Data Analysis", "A/B Testing"],
        "ats_keywords": ["Product Management", "Strategy", "Stakeholder Management", "Prioritization", "Metrics"]
    },
    {
        "title": "UX/UI Designer",
        "industry": "Design",
        "experience_level": "Mid",
        "required_skills": ["Figma", "Wireframing", "Prototyping", "User Research", "Adobe Creative Suite"],
        "preferred_skills": ["HTML", "CSS", "Interaction Design", "Usability Testing"],
        "ats_keywords": ["UX", "UI", "User Experience", "User Interface", "Design Systems"]
    },
    {
        "title": "Machine Learning Engineer",
        "industry": "AI/Data",
        "experience_level": "Mid",
        "required_skills": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "SQL"],
        "preferred_skills": ["NLP", "Computer Vision", "MLOps", "Spark", "C++"],
        "ats_keywords": ["ML", "AI", "Deep Learning", "Model Deployment", "Algorithms"]
    },
    {
        "title": "Cybersecurity Analyst",
        "industry": "Security",
        "experience_level": "Mid",
        "required_skills": ["Network Security", "Vulnerability Assessment", "SIEM", "Incident Response"],
        "preferred_skills": ["Penetration Testing", "Python", "CISSP", "CEH"],
        "ats_keywords": ["Security", "Threat Hunting", "Risk Management", "Firewalls", "InfoSec"]
    },
    {
        "title": "Cloud Architect",
        "industry": "Infrastructure",
        "experience_level": "Senior",
        "required_skills": ["AWS", "Azure", "GCP", "System Architecture", "Kubernetes"],
        "preferred_skills": ["Terraform", "Serverless", "Python", "Microservices"],
        "ats_keywords": ["Cloud Computing", "Architecture", "Scalability", "High Availability", "Migration"]
    },
    {
        "title": "Mobile App Developer",
        "industry": "Software Engineering",
        "experience_level": "Mid",
        "required_skills": ["React Native", "Swift", "Kotlin", "Mobile UI", "REST APIs"],
        "preferred_skills": ["Flutter", "GraphQL", "Firebase", "App Store Deployment"],
        "ats_keywords": ["Mobile", "iOS", "Android", "Cross-Platform", "App Development"]
    }
]

def seed_jobs():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        count = db.query(JobRole).count()
        if count > 0:
            print(f"Database already contains {count} job roles. Skipping seed.")
            return

        print(f"Seeding {len(jobs_data)} job roles...")
        for job_data in jobs_data:
            job = JobRole(**job_data)
            db.add(job)
        
        db.commit()
        print("Successfully seeded job roles.")
        
    except Exception as e:
        print(f"Error seeding jobs: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_jobs()
