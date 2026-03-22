from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from app.models.membership import MembershipType, PaymentStatus

class MembershipBase(BaseModel):
    user_id: int
    type: MembershipType
    start_date: date
    end_date: date
    is_active: bool = True
    payment_status: PaymentStatus = "pending"
    converted_from_trial: bool = False

class MembershipCreate(MembershipBase):
    pass

class MembershipResponse(MembershipBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MembershipAdminResponse(MembershipResponse):
    user_name: Optional[str] = None