from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

from app.db.mock_data import MOCK_PRESCRIPTIONS



class PrescriptionCreate(BaseModel):
    patient: str
    medicines: str
    dosage: str
    notes: Optional[str] = ""


@router.get("/")
async def get_prescriptions(doctor: Optional[str] = None, patient: Optional[str] = None):
    result = MOCK_PRESCRIPTIONS
    if doctor:
        result = [p for p in result if p["doctor"].lower() == doctor.lower()]
    if patient:
        result = [p for p in result if p["patient"].lower() == patient.lower()]
    return result


@router.post("/")
async def create_prescription(rx: PrescriptionCreate, doctor: str = "Dr. Smith"):
    new_id = max(p["id"] for p in MOCK_PRESCRIPTIONS) + 1 if MOCK_PRESCRIPTIONS else 1
    new_rx = {
        "id": new_id,
        "patient": rx.patient,
        "doctor": doctor,
        "date": "2026-03-15",
        "medicines": rx.medicines,
        "dosage": rx.dosage,
        "notes": rx.notes or ""
    }
    MOCK_PRESCRIPTIONS.append(new_rx)
    return {"message": "Prescription created successfully", "prescription": new_rx}
