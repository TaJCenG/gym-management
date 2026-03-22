from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.gym_class import GymClass
from app.schemas.gym_class import GymClassResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[GymClassResponse])
def get_classes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    classes = db.query(GymClass).filter(GymClass.is_active == True).offset(skip).limit(limit).all()
    return classes

@router.get("/{class_id}", response_model=GymClassResponse)
def get_class(class_id: int, db: Session = Depends(get_db)):
    gym_class = db.query(GymClass).filter(GymClass.id == class_id, GymClass.is_active == True).first()
    if not gym_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return gym_class