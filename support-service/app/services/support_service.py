from uuid import uuid4
from datetime import datetime, date, timedelta
from app.schemas.support import ChatMessageRequest, ChatbotResponse, StaffAvailabilityQuery, StaffAvailabilityResponse, TimeSlot, BookingRequest, BookingResponse
from app.services.ai_service import AIService
from app.services.zoom_service import ZoomService

class SupportService:
    def __init__(self):
        self.ai_service = AIService()
        self.zoom_service = ZoomService()
        # In a real app, this would use a database (Prisma/SQLAlchemy)
        # and a cache (Redis)
        self.chat_session_store = {}
        self.bookings = [] 

    async def process_chat_message(self, user_id: str, request: ChatMessageRequest) -> ChatbotResponse:
        session_id = request.session_id or str(uuid4())
        history = self.chat_session_store.get(session_id, [])
        user_context = {"user_id": user_id} # Fetch real context from DB
        
        ai_result = await self.ai_service.generate_chatbot_response(request.message, user_context, history)
        
        history.append({"role": "user", "content": request.message})
        history.append({"role": "assistant", "content": ai_result["response"]})
        self.chat_session_store[session_id] = history

        return ChatbotResponse(**ai_result, session_id=session_id)

    async def get_staff_availability(self, query: StaffAvailabilityQuery) -> StaffAvailabilityResponse:
        # This is a mock implementation. A real one would query the database.
        availability = {}
        current_date = query.start_date
        while current_date <= query.end_date:
            daily_slots = []
            if current_date.weekday() < 5: # Monday to Friday
                for hour in range(9, 18):
                    slot_start = datetime.combine(current_date, datetime.min.time()).replace(hour=hour)
                    daily_slots.append(TimeSlot(
                        start_time=slot_start,
                        end_time=slot_start + timedelta(hours=1),
                        staff_id="staff_mock_id_01"
                    ))
            if daily_slots:
                availability[current_date] = daily_slots
            current_date += timedelta(days=1)
        return StaffAvailabilityResponse(availability=availability)

    async def book_session(self, user_id: str, request: BookingRequest) -> BookingResponse:
        zoom_meeting = await self.zoom_service.create_meeting(
            topic=f"Support Counseling for User {user_id}",
            start_time=request.start_time
        )
        session_id = str(uuid4())
        # TODO: Save booking to database
        self.bookings.append({"session_id": session_id, "user_id": user_id, "start_time": request.start_time})
        
        return BookingResponse(
            counseling_session_id=session_id,
            scheduled_at=request.start_time,
            join_url=zoom_meeting["join_url"],
        )