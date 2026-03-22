from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.trainer import Trainer
from app.models.gym_class import GymClass
from app.schemas.admin import AdminLogin, Token, AdminCreate, AdminResponse
from app.schemas.trainer import TrainerCreate, TrainerResponse
from app.schemas.gym_class import GymClassCreate, GymClassResponse
from datetime import timedelta
from app.core.config import settings
from app.core.security import get_password_hash

router = APIRouter()

# ----------------- Admin Auth -----------------
@router.post("/login", response_model=Token)
def login(admin_data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == admin_data.email).first()
    if not admin or not verify_password(admin_data.password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(admin.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# (Optional) Create first admin via endpoint – but better to seed manually
@router.post("/register", response_model=AdminResponse, status_code=201)
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(Admin).filter(Admin.email == admin.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(admin.password)
    db_admin = Admin(email=admin.email, name=admin.name, password_hash=hashed, role="manager")
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# ----------------- Trainer Management -----------------
@router.get("/trainers", response_model=List[TrainerResponse])
def get_all_trainers(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    return db.query(Trainer).all()

@router.post("/trainers", response_model=TrainerResponse, status_code=201)
def create_trainer(trainer: TrainerCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    db_trainer = Trainer(**trainer.model_dump())
    db.add(db_trainer)
    db.commit()
    db.refresh(db_trainer)
    return db_trainer

@router.put("/trainers/{trainer_id}", response_model=TrainerResponse)
def update_trainer(trainer_id: int, trainer: TrainerCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    db_trainer = db.query(Trainer).filter(Trainer.id == trainer_id).first()
    if not db_trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    for key, value in trainer.model_dump().items():
        setattr(db_trainer, key, value)
    db.commit()
    db.refresh(db_trainer)
    return db_trainer

@router.delete("/trainers/{trainer_id}", status_code=204)
def delete_trainer(trainer_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    db_trainer = db.query(Trainer).filter(Trainer.id == trainer_id).first()
    if not db_trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    db_trainer.is_active = False
    db.commit()
    return

# ----------------- Class Management -----------------
@router.get("/classes", response_model=List[GymClassResponse])
def get_all_classes(db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    return db.query(GymClass).all()

@router.post("/classes", response_model=GymClassResponse, status_code=201)
def create_class(gym_class: GymClassCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    db_class = GymClass(**gym_class.model_dump())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@router.put("/classes/{class_id}", response_model=GymClassResponse)
def update_class(class_id: int, gym_class: GymClassCreate, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    db_class = db.query(GymClass).filter(GymClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    for key, value in gym_class.model_dump().items():
        setattr(db_class, key, value)
    db.commit()
    db.refresh(db_class)
    return db_class

@router.delete("/classes/{class_id}", status_code=204)
def delete_class(class_id: int, db: Session = Depends(get_db), admin: Admin = Depends(get_current_admin)):
    db_class = db.query(GymClass).filter(GymClass.id == class_id).first()
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(db_class)
    db.commit()
    return