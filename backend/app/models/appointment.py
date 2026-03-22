from sqlalchemy import Column, Integer, ForeignKey, Date, Time, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AppointmentStatus(enum.Enum):
    pending = "pending"
    booked = "booked"
    completed = "completed"
    cancelled = "cancelled"

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trainer_id = Column(Integer, ForeignKey("trainers.id"), nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)
    appointment_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(Enum(AppointmentStatus), default="pending")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())