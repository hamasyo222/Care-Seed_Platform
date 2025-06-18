from pydantic import BaseModel

class PlatformSummaryReport(BaseModel):
    total_users: int
    total_companies: int
    total_log_entries: int
