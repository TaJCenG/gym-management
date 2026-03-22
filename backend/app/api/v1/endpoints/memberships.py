from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.models.membership import Membership, MembershipType, PaymentStatus
from app.schemas.membership import MembershipCreate, MembershipResponse, MembershipAdminResponse
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from datetime import date, timedelta
from sqlalchemy.orm import joinedload

router = APIRouter()


# --- Public endpoints (user) ---
@router.get("/my", response_model=List[MembershipResponse])
def get_my_memberships(phone: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    memberships = db.query(Membership).filter(Membership.user_id == user.id).all()
    return memberships


@router.post("/convert", response_model=MembershipResponse)
def convert_trial_to_paid(
        user_phone: str,
        new_type: MembershipType,  # monthly or quarterly
        db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.phone_number == user_phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get active trial membership
    trial = db.query(Membership).filter(
        Membership.user_id == user.id,
        Membership.type == MembershipType.trial,
        Membership.is_active == True
    ).first()
    if not trial:
        raise HTTPException(status_code=400, detail="No active trial membership found")

    # Deactivate trial
    trial.is_active = False

    # Determine end date based on new type
    if new_type == MembershipType.monthly:
        end_date = date.today() + timedelta(days=30)
    else:
        end_date = date.today() + timedelta(days=90)

    new_membership = Membership(
        user_id=user.id,
        type=new_type,
        start_date=date.today(),
        end_date=end_date,
        is_active=True,
        payment_status=PaymentStatus.paid,  # In real app you'd handle payment flow
        converted_from_trial=True
    )
    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)
    return new_membership


# --- Admin endpoints ---
@router.get("/admin", response_model=List[MembershipAdminResponse])
def get_all_memberships(
        db: Session = Depends(get_db),
        admin: Admin = Depends(get_current_admin)
):
    # Use joinedload to fetch user data in same query
    memberships = db.query(Membership).options(joinedload(Membership.user)).all()

    # Build response with user name
    result = []
    for m in memberships:
        # Convert membership to dict (or use pydantic model)
        m_dict = {c.name: getattr(m, c.name) for c in m.__table__.columns}
        m_dict["user_name"] = m.user.name if m.user else None
        result.append(m_dict)
    return result