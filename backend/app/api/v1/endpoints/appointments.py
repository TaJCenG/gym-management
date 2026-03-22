from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.appointment import AvailabilityCheck, AvailabilityResponse
from app.services import booking_service
from app.schemas.appointment import AppointmentCreate, AppointmentResponse

router = APIRouter()


@router.post("/check-availability", response_model=AvailabilityResponse)
def check_availability(check: AvailabilityCheck, db: Session = Depends(get_db)):
    if check.trainer_id and check.class_id:
        raise HTTPException(status_code=400, detail="Provide either trainer_id or class_id, not both")
    if not check.trainer_id and not check.class_id:
        raise HTTPException(status_code=400, detail="Provide either trainer_id or class_id")

    if check.trainer_id:
        available = booking_service.check_trainer_availability(
            db, check.trainer_id, check.appointment_date, check.start_time, check.end_time
        )
        message = "Trainer is available" if available else "Trainer is not available at that time"
    else:
        available = booking_service.check_class_availability(
            db, check.class_id, check.appointment_date, check.start_time, check.end_time
        )
        message = "Class has available slots" if available else "Class is full or not available"

    return AvailabilityResponse(available=available, message=message)


@router.post("/", response_model=AppointmentResponse, status_code=201)
def book_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    try:
        new_appointment = booking_service.create_appointment(db, appointment)
        return new_appointment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Booking failed")