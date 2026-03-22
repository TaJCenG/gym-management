from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.core.database import get_db
from app.models.appointment import Appointment
from app.models.membership import Membership
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from datetime import datetime
from typing import Dict

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)) -> Dict:
    today = datetime.now().date()
    total_appointments = db.query(Appointment).count()
    today_appointments = db.query(Appointment).filter(Appointment.appointment_date == today).count()
    active_members = db.query(Membership).filter(Membership.is_active == True, Membership.end_date >= today).count()
    trial_members = db.query(Membership).filter(Membership.type == "trial", Membership.is_active == True).count()

    popular_classes = db.query(
        Appointment.class_id, func.count(Appointment.id).label("count")
    ).filter(Appointment.class_id != None).group_by(Appointment.class_id).order_by(func.count(Appointment.id).desc()).limit(5).all()

    trainer_util = db.query(
        Appointment.trainer_id, func.count(Appointment.id).label("count")
    ).filter(Appointment.trainer_id != None).group_by(Appointment.trainer_id).order_by(func.count(Appointment.id).desc()).all()

    peak_hours = db.query(
        extract('hour', Appointment.start_time).label("hour"),
        func.count(Appointment.id).label("count")
    ).group_by(extract('hour', Appointment.start_time)).order_by(func.count(Appointment.id).desc()).limit(5).all()

    return {
        "total_appointments": total_appointments,
        "today_appointments": today_appointments,
        "active_members": active_members,
        "trial_members": trial_members,
        "popular_classes": [{"class_id": c[0], "count": c[1]} for c in popular_classes],
        "trainer_utilization": [{"trainer_id": t[0], "count": t[1]} for t in trainer_util],
        "peak_hours": [{"hour": int(h[0]), "count": h[1]} for h in peak_hours],
    }