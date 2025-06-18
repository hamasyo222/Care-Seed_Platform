from uuid import uuid4
from app.schemas.support import ChatMessageRequest, ChatbotResponse
from app.services.ai_service import AIService
from app.services.zoom_service import ZoomService

class SupportService:
    def __init__(self):
        self.ai_service = AIService()
        self.zoom_service = ZoomService()

    async def process_chat_message(self, user_id: str, request: ChatMessageRequest) -> ChatbotResponse:
        user_context = {"nationality": "VNM", "job_type": "Care Worker"}
        history = []  # Get from Redis/DB

        ai_result = await self.ai_service.generate_chatbot_response(request.message, user_context, history)

        # TODO: 相談内容をDBに保存
        
        return ChatbotResponse(**ai_result, session_id=request.session_id or str(uuid4()))

    async def book_session(self, user_id: str, request: dict) -> dict:
        # TODO: 予約スロットの競合チェック
        
        zoom_meeting = await self.zoom_service.create_meeting(
            topic=f"Support Counseling for User {user_id}",
            start_time=request['start_time']
        )
        
        # TODO: 予約情報をDBに保存
        
        return { "counseling_session_id": str(uuid4()), "join_url": zoom_meeting["join_url"] }
