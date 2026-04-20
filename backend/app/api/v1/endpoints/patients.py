from fastapi import APIRouter
from typing import Optional

router = APIRouter()

from app.db.mock_data import MOCK_PATIENTS



@router.get("/")
async def get_patients(doctor: Optional[str] = None, name: Optional[str] = None):
    result = MOCK_PATIENTS
    if doctor:
        result = [p for p in result if p["assigned_doctor"].lower() == doctor.lower()]
    if name:
        result = [p for p in result if p["name"].lower() == name.lower()]
    return result
