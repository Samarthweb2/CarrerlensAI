import os
import sys
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add the parent directory and current directory to path to ensure robust imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from api.routes.resume import router as resume_router
from api.routes.jobs import router as jobs_router
from api.routes.dashboard import router as dashboard_router
from api.routes.auth import router as auth_router
from api.routes.health import router as health_router

# Database initialization
from database.database import Base, engine
from sqlalchemy import text
Base.metadata.create_all(bind=engine)

# Run raw SQL migrations to safely add new columns to SQLite/PostgreSQL tables if they don't exist
try:
    # Analyses columns
    for col_name, col_type in [
        ("job_description", "TEXT"),
        ("improvements", "JSON"),
        ("interview_questions", "JSON"),
        ("keyword_match", "JSON"),
        ("roadmap", "JSON"),
        ("job_matches", "JSON")
    ]:
        try:
            with engine.begin() as conn:
                conn.execute(text(f"ALTER TABLE analyses ADD COLUMN {col_name} {col_type}"))
        except Exception:
            pass
    # Users columns
    for col_name, col_type in [("verification_code", "TEXT"), ("reset_token", "TEXT"), ("profile_pic", "TEXT")]:
        try:
            with engine.begin() as conn:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
        except Exception:
            pass
    # JobRoles columns
    for col_name, col_type in [
        ("company", "TEXT"),
        ("location", "TEXT"),
        ("description", "TEXT"),
        ("required_skills", "JSON"),
        ("preferred_skills", "JSON"),
        ("experience_level", "TEXT"),
        ("salary_min", "INTEGER"),
        ("salary_max", "INTEGER"),
        ("work_type", "TEXT"),
        ("ats_keywords", "JSON")
    ]:
        try:
            with engine.begin() as conn:
                conn.execute(text(f"ALTER TABLE job_roles ADD COLUMN {col_name} {col_type}"))
        except Exception:
            pass

except Exception as migration_err:
    print(f"Migration warning: {migration_err}")

# Auto-seed default JobRole values if the table is empty (highly useful for fresh SQLite / Render Postgres setups)
try:
    from database.database import SessionLocal
    from database.models import JobRole
    with SessionLocal() as db:
        if db.query(JobRole).count() == 0:
            default_roles = [
                JobRole(
                    title="Associate Data Analyst",
                    company="Google",
                    location="Bangalore",
                    industry="Data & Analytics",
                    description="Analyze large datasets, write SQL queries, build dashboards, and present insights.",
                    required_skills=["SQL", "Python", "Tableau", "Excel"],
                    preferred_skills=["Pandas", "Power BI"],
                    experience_level="Entry",
                    salary_min=1800000,
                    salary_max=2400000,
                    work_type="Remote",
                    ats_keywords=["SQL", "Python", "Tableau", "Data Analysis", "Reporting"]
                ),
                JobRole(
                    title="Data Engineer I",
                    company="Microsoft",
                    location="Hyderabad",
                    industry="Infrastructure",
                    description="Design, build, and maintain data pipelines using Spark, SQL, and Azure.",
                    required_skills=["SQL", "Python", "Spark", "AWS"],
                    preferred_skills=["Docker", "Kubernetes", "Airflow"],
                    experience_level="Entry",
                    salary_min=2000000,
                    salary_max=2600000,
                    work_type="Hybrid",
                    ats_keywords=["SQL", "Python", "Spark", "Data Pipelines", "ETL"]
                ),
                JobRole(
                    title="React Developer",
                    company="Netflix",
                    location="Mumbai",
                    industry="Software Engineering",
                    description="Build modern React web applications using TypeScript and Tailwind CSS.",
                    required_skills=["React", "JavaScript", "HTML", "CSS"],
                    preferred_skills=["TypeScript", "Next.js", "Vite"],
                    experience_level="Mid",
                    salary_min=2200000,
                    salary_max=3200000,
                    work_type="On-site",
                    ats_keywords=["React", "JavaScript", "HTML", "CSS", "Frontend"]
                ),
                JobRole(
                    title="FastAPI Backend Engineer",
                    company="Stripe",
                    location="Bangalore",
                    industry="Software Engineering",
                    description="Develop high-performance backend APIs using FastAPI, PostgreSQL, and Docker.",
                    required_skills=["Python", "FastAPI", "SQL", "Docker"],
                    preferred_skills=["PostgreSQL", "Redis", "AWS"],
                    experience_level="Mid",
                    salary_min=2400000,
                    salary_max=3600000,
                    work_type="Remote",
                    ats_keywords=["FastAPI", "Python", "SQL", "Docker", "APIs"]
                ),
                JobRole(
                    title="Machine Learning Engineer",
                    company="Amazon",
                    location="Chennai",
                    industry="AI & Machine Learning",
                    description="Train and deploy machine learning models using TensorFlow, PyTorch, and Python.",
                    required_skills=["Python", "Machine Learning", "TensorFlow", "PyTorch"],
                    preferred_skills=["Scikit-learn", "NLP", "Deep Learning"],
                    experience_level="Senior",
                    salary_min=3000000,
                    salary_max=4500000,
                    work_type="Hybrid",
                    ats_keywords=["Machine Learning", "TensorFlow", "PyTorch", "Python", "Models"]
                ),
                JobRole(
                    title="DevOps Cloud Engineer",
                    company="Atlassian",
                    location="Pune",
                    industry="Infrastructure",
                    description="Automate cloud infrastructure deployments using Terraform, Git, and Kubernetes.",
                    required_skills=["AWS", "Docker", "Kubernetes", "Git"],
                    preferred_skills=["Terraform", "CI/CD", "Linux"],
                    experience_level="Senior",
                    salary_min=2800000,
                    salary_max=4200000,
                    work_type="Remote",
                    ats_keywords=["DevOps", "Kubernetes", "Docker", "AWS", "Terraform"]
                )
            ]
            db.add_all(default_roles)
            db.commit()
            print(f"Successfully seeded {len(default_roles)} default job roles in database.")
except Exception as seed_err:
    print(f"Seeding warning: {seed_err}")

app = FastAPI(
    title="CareerLensAI API",
    description="Intelligent Resume & Talent Matching Engine API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

allowed_origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "https://careerlensai-frontend.onrender.com"
]

frontend_url_env = os.environ.get("FRONTEND_URL")
if frontend_url_env:
    for url in frontend_url_env.split(","):
        stripped = url.strip()
        if stripped:
            origin_no_slash = stripped.rstrip("/")
            if origin_no_slash not in allowed_origins:
                allowed_origins.append(origin_no_slash)
            origin_with_slash = origin_no_slash + "/"
            if origin_with_slash not in allowed_origins:
                allowed_origins.append(origin_with_slash)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(resume_router, prefix="/api/v1")
app.include_router(jobs_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(health_router)  # Expose /health at root for external ping services
@app.get("/", tags=["Health Check"])
async def health_check():
    """
    Returns application status and version.
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "CareerLensAI Backend API"
    }

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
