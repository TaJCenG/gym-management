from pydantic import BaseModel, ConfigDict
from datetime import datetime, time
from typing import Optional


class GymClassBase(BaseModel):
    name: str
    description: Optional[str] = None
    trainer_id: int
    capacity: int
    duration_minutes: int
    start_time: time
    end_time: time
    days_of_week: Optional[str] = None
    is_active: bool = True


class GymClassCreate(GymClassBase):
    pass


class GymClassResponse(GymClassBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)