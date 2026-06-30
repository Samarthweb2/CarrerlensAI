from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard Analytics"]
)

class AnalyticsSummaryResponse(BaseModel):
    status: str
    data: Dict[str, Any]

@router.get("/summary", response_model=AnalyticsSummaryResponse)
async def get_dashboard_summary():
    """
    Placeholder endpoint to fetch analytics summary for the dashboard.
    """
    return {
        "status": "success",
        "data": {
            "total_candidates": 0,
            "total_jobs": 0,
            "average_match_score": 0.0
        }
    }
