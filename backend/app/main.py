from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.database import engine, Base
from app.models import *  # This imports all models so they are registered

# Create database tables (for development; use migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gym Management API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Gym Management API"}


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created (if not exist)")