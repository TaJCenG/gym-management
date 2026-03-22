from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class TrainerBase(BaseModel):
    name: str
    specialization: Optional[str] = None
    bio: Optional[str] = None
    profile_pic: Optional[str] = None
    is_active: bool = True


class TrainerCreate(TrainerBase):
    pass


class TrainerResponse(TrainerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)