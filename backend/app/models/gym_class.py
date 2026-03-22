from sqlalchemy import Column, Integer, String, Text, Time, ForeignKey, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class GymClass(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    trainer_id = Column(Integer, ForeignKey("trainers.id"), nullable=False)
    capacity = Column(Integer, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    days_of_week = Column(String(20), nullable=True)  # e.g., "Mon,Wed,Fri"
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())