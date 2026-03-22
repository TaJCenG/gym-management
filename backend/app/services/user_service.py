from app.models.user import User
from app.schemas.user import UserCreate
from sqlalchemy.orm import Session


def create_user(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.phone_number == user_data.phone_number).first()
    if existing:
        # Optionally update fields if provided
        if user_data.name:
            existing.name = user_data.name
        if user_data.age:
            existing.age = user_data.age
        # Add other fields as needed
        db.commit()
        db.refresh(existing)
        return existing
    db_user = User(**user_data.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user