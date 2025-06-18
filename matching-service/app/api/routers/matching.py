from fastapi import APIRouter, Depends, status
from typing import Any
from uuid import uuid4
from app.schemas import matching as schemas
from app.deps import get_current_user, AuthenticatedUser

router = APIRouter()

@router.get("/talents/search", response_model=schemas.TalentSearchResponse)
def search_talents(query: schemas.TalentSearchQuery = Depends(), current_user: AuthenticatedUser = Depends(get_current_user)) -> Any:
    mock_talents = [
        schemas.TalentProfile(
            user_id=uuid4(),
            age=28,
            gender="female",
            nationality="VNM",
            location="Tokyo",
            skills=[{"name": "Python", "level": "advanced"}],
            japanese_level="N2",
            experience_years=5.0,
            matching_score=0.88,
        )
    ]
    return {"talents": mock_talents, "total": len(mock_talents), "page": query.page, "page_size": query.page_size}

@router.post("/talents/{talent_id}/interview-request", status_code=status.HTTP_202_ACCEPTED)
def request_interview(talent_id: str, request_body: schemas.InterviewRequest, current_user: AuthenticatedUser = Depends(get_current_user)) -> Any:
    return {"message": "Interview request successfully submitted. An administrator will contact you shortly."}
