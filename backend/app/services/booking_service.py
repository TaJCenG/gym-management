from sqlalchemy.orm import Session
from datetime import datetime, date, time, timedelta
from app.models.appointment import Appointment
from app.models.gym_class import GymClass
from app.models.user import User
from app.schemas.appointment import AppointmentCreate
from app.models.membership import Membership, MembershipType, PaymentStatus

def check_trainer_availability(db: Session, trainer_id: int, appointment_date: date, start_time: time,
                               end_time: time) -> bool:
    # Check if trainer has any overlapping appointments
    overlapping = db.query(Appointment).filter(
        Appointment.trainer_id == trainer_id,
        Appointment.appointment_date == appointment_date,
        Appointment.status.in_(["pending", "booked"]),
        Appointment.start_time < end_time,
        Appointment.end_time > start_time
    ).first()
    return overlapping is None


def check_class_availability(db: Session, class_id: int, appointment_date: date, start_time: time,
                             end_time: time) -> bool:
    # First, verify the class exists and is active
    gym_class = db.query(GymClass).filter(GymClass.id == class_id, GymClass.is_active == True).first()
    if not gym_class:
        return False

    # Check if the requested time matches the class schedule (optional, but we could enforce)
    # For simplicity, we'll just check capacity
    booked_count = db.query(Appointment).filter(
        Appointment.class_id == class_id,
        Appointment.appointment_date == appointment_date,
        Appointment.start_time == start_time,  # Assuming classes are at fixed times
        Appointment.status.in_(["pending", "booked"])
    ).count()

    return booked_count < gym_class.capacity


def create_appointment(db: Session, appointment_data: AppointmentCreate) -> Appointment:
    # Find user by phone
    user = db.query(User).filter(User.phone_number == appointment_data.user_phone).first()
    if not user:
        raise ValueError("User not found")

    # Check availability again (to avoid race conditions, but okay for now)
    if appointment_data.trainer_id:
        available = check_trainer_availability(
            db, appointment_data.trainer_id, appointment_data.appointment_date,
            appointment_data.start_time, appointment_data.end_time
        )
        if not available:
            raise ValueError("Trainer not available")
    elif appointment_data.class_id:
        available = check_class_availability(
            db, appointment_data.class_id, appointment_data.appointment_date,
            appointment_data.start_time, appointment_data.end_time
        )
        if not available:
            raise ValueError("Class not available")
    else:
        raise ValueError("Must specify trainer or class")

    # Create appointment
    db_appointment = Appointment(
        user_id=user.id,
        trainer_id=appointment_data.trainer_id,
        class_id=appointment_data.class_id,
        appointment_date=appointment_data.appointment_date,
        start_time=appointment_data.start_time,
        end_time=appointment_data.end_time,
        status="booked"  # or "pending" until confirmed
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    create_trial_membership_if_needed(db, user.id)
    return db_appointment


def create_trial_membership_if_needed(db: Session, user_id: int):
    # Check if user already has an active trial or paid membership
    active_membership = db.query(Membership).filter(
        Membership.user_id == user_id,
        Membership.is_active == True
    ).first()
    if active_membership:
        # Already has a membership, no need to create trial
        return active_membership

    # Create new trial membership
    trial = Membership(
        user_id=user_id,
        type=MembershipType.trial,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=7),
        is_active=True,
        payment_status=PaymentStatus.paid,
        converted_from_trial=False
    )
    db.add(trial)
    db.commit()
    db.refresh(trial)
    return trial