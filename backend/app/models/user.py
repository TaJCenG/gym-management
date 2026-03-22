from sqlalchemy import Column, Integer, String, Enum, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base
import enum
from sqlalchemy.orm import relationship

class FitnessGoal(enum.Enum):
    weight_loss = "weight_loss"
    muscle_gain = "muscle_gain"
    endurance = "endurance"
    general = "general"

class ExperienceLevel(enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String(15), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)  # in kg
    fitness_goal = Column(Enum(FitnessGoal), nullable=True)
    experience_level = Column(Enum(ExperienceLevel), nullable=True)
    injuries = Column(Text, nullable=True)
    availability = Column(Text, nullable=True)  # e.g., "Mon-Wed 5-7pm"
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    memberships = relationship("Membership", back_populates="user")