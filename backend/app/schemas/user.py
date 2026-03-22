from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import FitnessGoal, ExperienceLevel  # import enums

class UserBase(BaseModel):
    phone_number: str = Field(..., max_length=15, description="Mobile number with country code")
    name: Optional[str] = Field(None, max_length=100)
    age: Optional[int] = Field(None, ge=1, le=120)
    weight: Optional[float] = Field(None, description="Weight in kg")
    fitness_goal: Optional[FitnessGoal] = None
    experience_level: Optional[ExperienceLevel] = None
    injuries: Optional[str] = None
    availability: Optional[str] = None

class UserCreate(UserBase):
    pass  # same fields as base for creation

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)  # orm_mode