from sqlalchemy import Column, Integer, ForeignKey, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base

class AIInteractionLog(Base):
    __tablename__ = "ai_interaction_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # anonymous allowed
    session_id = Column(String(100), nullable=False)  # to group conversation
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    recommended_plan = Column(Text, nullable=True)  # JSON or text
    recommended_class_id = Column(Integer, ForeignKey("classes.id"), nullable=True)
    recommended_trainer_id = Column(Integer, ForeignKey("trainers.id"), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())