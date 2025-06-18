from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

class TalentSearchQuery(BaseModel):
    talent_type: str
    skills: Optional[List[str]] = None
    experience_min: Optional[int] = Field(None, ge=0)
    location: Optional[List[str]] = None
    japanese_level: Optional[str] = None
    specific_skill_field: Optional[str] = None
    page: int = Field(1, gt=0)
    page_size: int = Field(20, gt=0, le=100)

class TalentProfile(BaseModel):
    user_id: UUID
    age: int
    gender: str
    nationality: str
    location: str
    skills: List[dict]
    japanese_level: Optional[str] = None
    experience_years: float
    matching_score: float

    class Config:
        from_attributes = True

class TalentSearchResponse(BaseModel):
    talents: List[TalentProfile]
    total: int
    page: int
    page_size: int

class InterviewRequest(BaseModel):
    message: str = Field(..., max_length=1000)
    preferred_dates: List[str]
    position: str
