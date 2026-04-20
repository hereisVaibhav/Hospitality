from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

MOCK_STAFF = [
    {"id": 1, "name": "Dr. Sarah Johnson", "role": "doctor", "department": "Cardiology", "email": "sarah.j@hospital.com", "phone": "+1-555-0101", "status": "active"},
    {"id": 2, "name": "Dr. Michael Chen", "role": "doctor", "department": "Neurology", "email": "m.chen@hospital.com", "phone": "+1-555-0102", "status": "active"},
    {"id": 3, "name": "Dr. Emily Davis", "role": "doctor", "department": "Pediatrics", "email": "e.davis@hospital.com", "phone": "+1-555-0103", "status": "active"},
    {"id": 4, "name": "Nurse Rachel Green", "role": "nurse", "department": "Emergency", "email": "r.green@hospital.com", "phone": "+1-555-0201", "status": "active"},
    {"id": 5, "name": "Nurse James Wilson", "role": "nurse", "department": "ICU", "email": "j.wilson@hospital.com", "phone": "+1-555-0202", "status": "on-leave"},
    {"id": 6, "name": "Nurse Lisa Park", "role": "nurse", "department": "Cardiology", "email": "l.park@hospital.com", "phone": "+1-555-0203", "status": "active"},
    {"id": 7, "name": "Dr. Robert Martinez", "role": "doctor", "department": "Orthopedics", "email": "r.martinez@hospital.com", "phone": "+1-555-0104", "status": "active"},
    {"id": 8, "name": "Admin Jane Foster", "role": "admin", "department": "Administration", "email": "j.foster@hospital.com", "phone": "+1-555-0301", "status": "active"},
    {"id": 9, "name": "Dr. Priya Sharma", "role": "doctor", "department": "Dermatology", "email": "p.sharma@hospital.com", "phone": "+1-555-0105", "status": "active"},
    {"id": 10, "name": "Nurse Tom Hardy", "role": "nurse", "department": "Neurology", "email": "t.hardy@hospital.com", "phone": "+1-555-0204", "status": "inactive"},
]


class StaffCreate(BaseModel):
    name: str
    role: str
    department: str
    email: str
    phone: Optional[str] = None


@router.get("/")
async def get_staff(department: Optional[str] = None):
    if department:
        return [s for s in MOCK_STAFF if s["department"].lower() == department.lower()]
    return MOCK_STAFF


@router.post("/")
async def create_staff(staff: StaffCreate):
    new_id = max(s["id"] for s in MOCK_STAFF) + 1 if MOCK_STAFF else 1
    new_staff = {"id": new_id, **staff.dict(), "status": "active"}
    MOCK_STAFF.append(new_staff)
    return {"message": "Staff member added successfully", "staff": new_staff}


@router.delete("/{staff_id}")
async def delete_staff(staff_id: int):
    for i, s in enumerate(MOCK_STAFF):
        if s["id"] == staff_id:
            removed = MOCK_STAFF.pop(i)
            return {"message": f"Staff member '{removed['name']}' deleted successfully"}
    raise HTTPException(status_code=404, detail="Staff member not found")
