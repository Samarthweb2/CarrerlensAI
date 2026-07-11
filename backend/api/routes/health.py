import time
from fastapi import APIRouter, status

router = APIRouter(
    tags=["Health Check"]
)

# Record the startup time to calculate uptime
startup_time = time.time()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Dedicated health check endpoint used to keep the Render free-tier instance awake.
    Returns status and basic uptime metrics.
    """
    uptime_seconds = int(time.time() - startup_time)
    
    return {
        "status": "online",
        "service": "CareerLensAI Backend API",
        "uptime_seconds": uptime_seconds,
        "message": "Instance is awake and ready."
    }
