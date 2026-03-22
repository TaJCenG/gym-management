from fastapi import APIRouter

router = APIRouter()

@router.post("/send-otp")
async def send_otp():
    return {"message": "OTP sent"}

@router.post("/verify-otp")
async def verify_otp():
    return {"message": "OTP verified"}