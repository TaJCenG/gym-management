import random
import time
from typing import Dict

# In-memory store: phone -> (otp, expiry)
otp_store: Dict[str, tuple] = {}

def generate_otp(phone: str, expiry_seconds: int = 300) -> str:
    otp = str(random.randint(100000, 999999))
    otp_store[phone] = (otp, time.time() + expiry_seconds)
    return otp

def verify_otp(phone: str, otp: str) -> bool:
    if phone not in otp_store:
        return False
    stored_otp, expiry = otp_store[phone]
    if time.time() > expiry:
        del otp_store[phone]
        return False
    if stored_otp == otp:
        del otp_store[phone]
        return True
    return False