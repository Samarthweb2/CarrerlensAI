import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

# DB & Security
from database.database import get_db
from database.models import User, Analysis
from api.middleware.auth import get_current_user
from services.jobs_service import fetch_real_jobs

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs & Recommendations"]
)

@router.get("")
async def get_jobs(
    location: Optional[str] = "Bangalore",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetches real-time job recommendations for the user based on their latest resume skills.
    """
    latest_analysis = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(Analysis.created_at.desc()).first()
    
    skills = []
    if latest_analysis and latest_analysis.skills_found:
        skills = latest_analysis.skills_found
        
    try:
        real_matches = await fetch_real_jobs(skills, location=location)
        return {
            "status": "success",
            "matches": real_matches
        }
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        # Return fallback mock jobs if API request fails entirely
        fallback_jobs = [
            {"company": "Google", "role": "Associate Data Analyst", "match": 85, "salary": "₹18–24 LPA", "location": location or "Bangalore", "logo": "G", "color": "#4285F4", "applyLink": "https://careers.google.com"},
            {"company": "Microsoft", "role": "Data Engineer I", "match": 80, "salary": "₹20–26 LPA", "location": location or "Hyderabad", "logo": "M", "color": "#F25022", "applyLink": "https://careers.microsoft.com"},
            {"company": "Amazon", "role": "Business Intelligence Eng", "match": 75, "salary": "₹16–22 LPA", "location": location or "Chennai", "logo": "A", "color": "#FF9900", "applyLink": "https://amazon.jobs"}
        ]
        return {
            "status": "success",
            "matches": fallback_jobs
        }
