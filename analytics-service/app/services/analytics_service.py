import asyncio
import asyncpg
import motor.motor_asyncio
from app.core.config import settings
from app.schemas.analytics import PlatformSummaryReport

class AnalyticsService:
    async def generate_platform_summary(self) -> PlatformSummaryReport:
        pg_conn = await asyncpg.connect(settings.POSTGRES_URL)
        mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URL)
        mongo_db = mongo_client.logs_db

        try:
            results = await asyncio.gather(
                pg_conn.fetchval("SELECT COUNT(*) FROM users"),
                pg_conn.fetchval("SELECT COUNT(*) FROM companies"),
                mongo_db.user_activity_logs.count_documents({})
            )
            return PlatformSummaryReport(
                total_users=results[0] or 0,
                total_companies=results[1] or 0,
                total_log_entries=results[2] or 0,
            )
        finally:
            await pg_conn.close()
            mongo_client.close()
