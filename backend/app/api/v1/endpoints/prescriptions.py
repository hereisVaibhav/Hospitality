from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

MOCK_PRESCRIPTIONS = [
    {"id": 1, "patient": "John Doe", "doctor": "Dr. Smith", "date": "2026-03-15", "medicines": "Amlodipine 5mg, Metformin 500mg", "dosage": "Once daily after meals", "notes": "Monitor blood pressure weekly. Follow up in 30 days."},
    {"id": 2, "patient": "Bob Wilson", "doctor": "Dr. Smith", "date": "2026-03-14", "medicines": "Sumatriptan 50mg", "dosage": "As needed for migraine onset, max 2 per day", "notes": "Avoid triggers: bright lights, stress. MRI scheduled for next visit."},
    {"id": 3, "patient": "Charlie Davis", "doctor": "Dr. Smith", "date": "2026-03-13", "medicines": "Levetiracetam 500mg", "dosage": "Twice daily", "notes": "Seizure-free for 6 months. Continue current regimen."},
    {"id": 4, "patient": "Jane Smith", "doctor": "Dr. Sarah Johnson", "date": "2026-03-15", "medicines": "Flecainide 100mg", "dosage": "Twice daily", "notes": "Holter monitor results pending."},
    {"id": 5, "patient": "Eve Adams", "doctor": "Dr. Smith", "date": "2026-03-12", "medicines": "Sertraline 50mg, Zolpidem 5mg", "dosage": "Sertraline: morning, Zolpidem: bedtime as needed", "notes": "Follow-up in 2 weeks to assess response."},
]


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
