from datetime import datetime, timedelta

class ZoomService:
    async def create_meeting(self, topic: str, start_time: str) -> dict:
        # In production, integrate with Zoom API. Here we mock the response.
        start = datetime.fromisoformat(start_time)
        join_url = f"https://zoom.example.com/{topic.replace(' ', '-')}-{int(start.timestamp())}"
        return {"join_url": join_url, "start_time": start.isoformat()} 
