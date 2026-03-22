from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional

class AdminBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class AdminCreate(AdminBase):
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(AdminBase):
    id: int
    role: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str