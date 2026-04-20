from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

MOCK_DEPARTMENTS = [
    {"id": 1, "name": "Cardiology", "head_doctor": "Dr. Sarah Johnson", "staff_count": 12, "description": "Heart and cardiovascular system care", "status": "active"},
    {"id": 2, "name": "Neurology", "head_doctor": "Dr. Michael Chen", "staff_count": 9, "description": "Brain, spinal cord, and nervous system care", "status": "active"},
    {"id": 3, "name": "Pediatrics", "head_doctor": "Dr. Emily Davis", "staff_count": 15, "description": "Medical care for infants, children, and adolescents", "status": "active"},
    {"id": 4, "name": "Orthopedics", "head_doctor": "Dr. Robert Martinez", "staff_count": 8, "description": "Musculoskeletal system — bones, joints, muscles", "status": "active"},
    {"id": 5, "name": "Emergency", "head_doctor": "Dr. Alan Grant", "staff_count": 20, "description": "Immediate care for acute illnesses and injuries", "status": "active"},
    {"id": 6, "name": "Dermatology", "head_doctor": "Dr. Priya Sharma", "staff_count": 6, "description": "Skin, hair, and nail conditions", "status": "active"},
    {"id": 7, "name": "ICU", "head_doctor": "Dr. Karen White", "staff_count": 18, "description": "Intensive monitoring and life support for critically ill patients", "status": "active"},
    {"id": 8, "name": "Radiology", "head_doctor": "Dr. David Lee", "staff_count": 7, "description": "Medical imaging — X-rays, MRI, CT scans, ultrasound", "status": "active"},
]


class DepartmentCreate(BaseModel):
    name: str
    head_doctor: Optional[str] = None
    description: Optional[str] = None


@router.get("/")
async def get_departments():
    return MOCK_DEPARTMENTS


@router.post("/")
async def create_department(dept: DepartmentCreate):
    new_id = len(MOCK_DEPARTMENTS) + 1
    new_dept = {"id": new_id, "name": dept.name, "head_doctor": dept.head_doctor or "Unassigned", "staff_count": 0, "description": dept.description or "", "status": "active"}
    MOCK_DEPARTMENTS.append(new_dept)
    return {"message": "Department created successfully", "department": new_dept}
