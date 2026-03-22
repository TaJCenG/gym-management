from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.trainer import Trainer
from app.schemas.trainer import TrainerResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TrainerResponse])
def get_trainers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    trainers = db.query(Trainer).filter(Trainer.is_active == True).offset(skip).limit(limit).all()
    return trainers

@router.get("/{trainer_id}", response_model=TrainerResponse)
def get_trainer(trainer_id: int, db: Session = Depends(get_db)):
    trainer = db.query(Trainer).filter(Trainer.id == trainer_id, Trainer.is_active == True).first()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    return trainer