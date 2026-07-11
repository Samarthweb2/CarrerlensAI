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

# Run raw SQL migrations to safely add new columns to SQLite tables if they don't exist
try:
    with engine.begin() as conn:
        # Analyses columns
        for col_name, col_type in [("job_description", "TEXT"), ("improvements", "JSON"), ("interview_questions", "JSON")]:
            try:
                conn.execute(text(f"ALTER TABLE analyses ADD COLUMN {col_name} {col_type}"))
            except Exception:
                pass
        # Users columns
        for col_name, col_type in [("verification_code", "TEXT"), ("reset_token", "TEXT"), ("profile_pic", "TEXT")]:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
            except Exception:
                pass
except Exception as migration_err:
    print(f"Migration warning: {migration_err}")

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
        if stripped and stripped not in allowed_origins:
            allowed_origins.append(stripped)

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
