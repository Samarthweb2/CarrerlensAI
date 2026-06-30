import os
import sys
# pyrefly: ignore [missing-import]
from fastapi import FastAPI

# Add the parent directory and current directory to path to ensure robust imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from api.routes.resume import router as resume_router
from api.routes.jobs import router as jobs_router
from api.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="CareerLensAI API",
    description="Intelligent Resume & Talent Matching Engine API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Register routers
app.include_router(resume_router, prefix="/api/v1")
app.include_router(jobs_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")

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
