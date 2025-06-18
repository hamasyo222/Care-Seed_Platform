from fastapi import APIRouter
from app.services.analytics_service import AnalyticsService

router = APIRouter()
service = AnalyticsService()

@router.get("/summary")
async def get_summary():
    report = await service.generate_platform_summary()
    return {"success": True, "data": report}
