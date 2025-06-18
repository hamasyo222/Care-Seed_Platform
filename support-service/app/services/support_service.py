from uuid import uuid4
from app.schemas.support import ChatMessageRequest, ChatbotResponse
from app.services.ai_service import AIService
from app.services.zoom_service import ZoomService

class SupportService:
    def __init__(self):
        self.ai_service = AIService()
        self.zoom_service = ZoomService()
        # simple in-memory storage for demo purposes
        self._messages = []
        self._sessions = []

    async def process_chat_message(self, user_id: str, request: ChatMessageRequest) -> ChatbotResponse:
        user_context = {"nationality": "VNM", "job_type": "Care Worker"}
        history = [m for m in self._messages if m["user_id"] == user_id]

        ai_result = await self.ai_service.generate_chatbot_response(request.message, user_context, history)
        self._messages.append({
            "user_id": user_id,
            "message": request.message,
        })

        return ChatbotResponse(**ai_result, session_id=request.session_id or str(uuid4()))

    async def book_session(self, user_id: str, request: dict) -> dict:
        # simple slot conflict check in memory
        if any(s["start_time"] == request["start_time"] for s in self._sessions):
            raise ValueError("Requested slot already booked")

        zoom_meeting = await self.zoom_service.create_meeting(
            topic=f"Support Counseling for User {user_id}",
            start_time=request['start_time']
        )
        session = {
            "counseling_session_id": str(uuid4()),
            "user_id": user_id,
            "start_time": request["start_time"],
            "join_url": zoom_meeting["join_url"],
        }
        self._sessions.append(session)

        return { "counseling_session_id": session["counseling_session_id"], "join_url": session["join_url"] }
