from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

# ─── Mock Data ────────────────────────────────────────────────────────────────

from app.db.mock_data import WARDS, BEDS, EMERGENCY_REQUESTS, save_data


class AdmitRequest(BaseModel):
    bed_id: int
    patient_name: str
    condition: str
    admitted_by: str


class EmergencyRequest(BaseModel):
    patient_name: str
    symptoms: str
    severity: int   # 1 (mild) – 5 (critical)
    contact_number: str
    ward_preference: Optional[str] = None


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/wards")
async def get_wards():
    result = []
    for ward in WARDS:
        ward_beds = [b for b in BEDS if b["ward_id"] == ward["id"]]
        available = sum(1 for b in ward_beds if b["status"] == "available")
        occupied  = sum(1 for b in ward_beds if b["status"] == "occupied")
        reserved  = sum(1 for b in ward_beds if b["status"] == "reserved")
        result.append({
            **ward,
            "available_beds": available,
            "occupied_beds":  occupied,
            "reserved_beds":  reserved,
            "occupancy_pct":  round((occupied + reserved) / ward["total_beds"] * 100),
        })
    return result


@router.get("/beds")
async def get_beds(ward_id: Optional[int] = None, status: Optional[str] = None):
    result = BEDS
    if ward_id:
        result = [b for b in result if b["ward_id"] == ward_id]
    if status:
        result = [b for b in result if b["status"] == status]
    return result


@router.get("/summary")
async def get_summary():
    total     = len(BEDS)
    available = sum(1 for b in BEDS if b["status"] == "available")
    occupied  = sum(1 for b in BEDS if b["status"] == "occupied")
    reserved  = sum(1 for b in BEDS if b["status"] == "reserved")
    return {
        "total_beds": total,
        "available":  available,
        "occupied":   occupied,
        "reserved":   reserved,
        "occupancy_pct": round((occupied + reserved) / total * 100),
        "pending_requests": len(EMERGENCY_REQUESTS),
    }


@router.post("/beds/{bed_id}/admit")
async def admit_patient(bed_id: int, body: AdmitRequest):
    for bed in BEDS:
        if bed["id"] == bed_id:
            if bed["status"] == "occupied":
                raise HTTPException(status_code=409, detail="Bed is already occupied.")
            bed["status"]      = "occupied"
            bed["patient"]     = body.patient_name
            bed["condition"]   = body.condition
            bed["admitted_by"] = body.admitted_by
            bed["admitted_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            save_data()
            return {"message": f"Patient '{body.patient_name}' admitted to {bed['bed_no']}", "bed": bed}
    raise HTTPException(status_code=404, detail="Bed not found.")


@router.post("/beds/{bed_id}/discharge")
async def discharge_patient(bed_id: int):
    for bed in BEDS:
        if bed["id"] == bed_id:
            if bed["status"] == "available":
                raise HTTPException(status_code=400, detail="Bed is already empty.")
            patient_name  = bed.get("patient", "Unknown")
            bed["status"]      = "available"
            bed["patient"]     = None
            bed["condition"]   = None
            bed["admitted_at"] = None
            bed["admitted_by"] = None
            save_data()
            return {"message": f"Patient '{patient_name}' discharged from {bed['bed_no']}", "bed": bed}
    raise HTTPException(status_code=404, detail="Bed not found.")


@router.post("/request")
async def request_emergency(body: EmergencyRequest):
    if not 1 <= body.severity <= 5:
        raise HTTPException(status_code=400, detail="Severity must be between 1 and 5.")
    req_id = len(EMERGENCY_REQUESTS) + 1
    new_req = {
        "id":              req_id,
        "patient_name":    body.patient_name,
        "symptoms":        body.symptoms,
        "severity":        body.severity,
        "contact_number":  body.contact_number,
        "ward_preference": body.ward_preference,
        "status":          "pending",
        "submitted_at":    datetime.now().strftime("%Y-%m-%d %H:%M"),
        "estimated_wait":  f"{body.severity * 3 + 2} minutes" if body.severity >= 3 else "15–20 minutes",
    }
    EMERGENCY_REQUESTS.append(new_req)
    save_data()
    return {
        "message":        "Emergency request submitted. Our team will respond shortly.",
        "request_id":     req_id,
        "estimated_wait": new_req["estimated_wait"],
        "request":        new_req,
    }


@router.get("/requests")
async def get_requests(status: Optional[str] = None):
    result = EMERGENCY_REQUESTS
    if status:
        result = [r for r in result if r["status"] == status]
    return result
