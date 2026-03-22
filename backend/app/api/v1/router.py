from fastapi import APIRouter
from app.api.v1.endpoints import auth, appointments, memberships, trainers, gym_classes, admin, analytics, users
# add users
# ...

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])  # new
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(memberships.router, prefix="/memberships", tags=["memberships"])
api_router.include_router(trainers.router, prefix="/trainers", tags=["trainers"])
api_router.include_router(gym_classes.router, prefix="/classes", tags=["classes"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(memberships.router, prefix="/memberships", tags=["memberships"])