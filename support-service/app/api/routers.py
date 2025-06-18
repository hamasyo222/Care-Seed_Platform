from fastapi import APIRouter, Depends
from app.schemas.support import ChatMessageRequest, ChatbotResponse
from app.services.support_service import SupportService

router = APIRouter()
service = SupportService()

@router.post('/chat', response_model=ChatbotResponse)
async def chat(request: ChatMessageRequest):
    return await service.process_chat_message('user1', request)

@router.post('/sessions')
async def book_session(request: dict):
    return await service.book_session('user1', request)
