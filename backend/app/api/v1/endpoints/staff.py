from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

from app.db.mock_data import MOCK_STAFF, save_data



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
    save_data()
    return {"message": "Staff member added successfully", "staff": new_staff}


@router.delete("/{staff_id}")
async def delete_staff(staff_id: int):
    for i, s in enumerate(MOCK_STAFF):
        if s["id"] == staff_id:
            removed = MOCK_STAFF.pop(i)
            save_data()
            return {"message": f"Staff member '{removed['name']}' deleted successfully"}
    raise HTTPException(status_code=404, detail="Staff member not found")
