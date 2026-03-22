from sqlalchemy import Column, Integer, ForeignKey, Enum, Date, Boolean, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class MembershipType(enum.Enum):
    trial = "trial"
    monthly = "monthly"
    quarterly = "quarterly"

class PaymentStatus(enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"

class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(MembershipType), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    payment_status = Column(Enum(PaymentStatus), default="pending")
    converted_from_trial = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    user = relationship("User", back_populates="memberships")