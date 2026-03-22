from pydantic import BaseModel, ConfigDict
from datetime import date, time, datetime
from typing import Optional
from app.models.appointment import AppointmentStatus

class AvailabilityCheck(BaseModel):
    trainer_id: Optional[int] = None
    class_id: Optional[int] = None
    appointment_date: date
    start_time: time
    end_time: time

class AvailabilityResponse(BaseModel):
    available: bool
    message: Optional[str] = None


class AppointmentCreate(BaseModel):
    user_phone: str  # We'll use phone to identify user (since no auth token)
    trainer_id: Optional[int] = None
    class_id: Optional[int] = None
    appointment_date: date
    start_time: time
    end_time: time


class AppointmentResponse(BaseModel):
    id: int
    user_id: int
    trainer_id: Optional[int]
    class_id: Optional[int]
    appointment_date: date
    start_time: time
    end_time: time
    status: AppointmentStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)