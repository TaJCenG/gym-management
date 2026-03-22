from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AdminRole(enum.Enum):
    super = "super"
    manager = "manager"

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=True)
    role = Column(Enum(AdminRole), default="manager")
    created_at = Column(TIMESTAMP, server_default=func.now())