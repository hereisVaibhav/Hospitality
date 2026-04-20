from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

# ─── Mock Data ────────────────────────────────────────────────────────────────

WARDS = [
    {"id": 1, "name": "Cardiac ICU",      "short": "CICU",  "color": "#ef4444", "total_beds": 8},
    {"id": 2, "name": "Neuro ICU",         "short": "NICU",  "color": "#8b5cf6", "total_beds": 6},
    {"id": 3, "name": "General Emergency", "short": "GEN",   "color": "#f59e0b", "total_beds": 10},
    {"id": 4, "name": "Trauma Unit",       "short": "TRMA",  "color": "#06b6d4", "total_beds": 8},
]

BEDS = [
    # Cardiac ICU (ward 1)
    {"id": 1,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-01", "status": "occupied", "patient": "John Doe",      "condition": "Critical — Myocardial Infarction", "admitted_at": "2026-04-04 07:30", "admitted_by": "Dr. Sarah Johnson"},
    {"id": 2,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-02", "status": "occupied", "patient": "Mary Watson",   "condition": "Severe — Arrhythmia",              "admitted_at": "2026-04-04 09:15", "admitted_by": "Dr. Sarah Johnson"},
    {"id": 3,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-03", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 4,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-04", "status": "reserved", "patient": "Harry Potter",  "condition": "Moderate — Chest Pain",            "admitted_at": "2026-04-04 11:00", "admitted_by": "Dr. Sarah Johnson"},
    {"id": 5,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-05", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 6,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-06", "status": "occupied", "patient": "Frank Castle",  "condition": "Stable — Post-Surgery",            "admitted_at": "2026-04-03 14:00", "admitted_by": "Dr. Sarah Johnson"},
    {"id": 7,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-07", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 8,  "ward_id": 1, "ward": "Cardiac ICU",      "bed_no": "CICU-08", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},

    # Neuro ICU (ward 2)
    {"id": 9,  "ward_id": 2, "ward": "Neuro ICU",        "bed_no": "NICU-01", "status": "occupied", "patient": "Bob Wilson",    "condition": "Critical — Traumatic Brain Injury","admitted_at": "2026-04-03 22:45", "admitted_by": "Dr. Michael Chen"},
    {"id": 10, "ward_id": 2, "ward": "Neuro ICU",        "bed_no": "NICU-02", "status": "occupied", "patient": "Grace Lee",     "condition": "Severe — Stroke",                  "admitted_at": "2026-04-04 03:10", "admitted_by": "Dr. Michael Chen"},
    {"id": 11, "ward_id": 2, "ward": "Neuro ICU",        "bed_no": "NICU-03", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 12, "ward_id": 2, "ward": "Neuro ICU",        "bed_no": "NICU-04", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 13, "ward_id": 2, "ward": "Neuro ICU",        "bed_no": "NICU-05", "status": "occupied", "patient": "Eve Adams",     "condition": "Stable — Seizure Monitoring",      "admitted_at": "2026-04-04 06:00", "admitted_by": "Dr. Michael Chen"},
    {"id": 14, "ward_id": 2, "ward": "Neuro ICU",        "bed_no": "NICU-06", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},

    # General Emergency (ward 3)
    {"id": 15, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-01",  "status": "occupied", "patient": "Alice Brown",   "condition": "Moderate — Fracture",              "admitted_at": "2026-04-04 10:00", "admitted_by": "Dr. Robert Martinez"},
    {"id": 16, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-02",  "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 17, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-03",  "status": "occupied", "patient": "Diana Prince",  "condition": "Mild — Severe Burns",              "admitted_at": "2026-04-04 08:30", "admitted_by": "Dr. Priya Sharma"},
    {"id": 18, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-04",  "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 19, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-05",  "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 20, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-06",  "status": "reserved", "patient": "Charlie Davis", "condition": "Moderate — Abdominal Pain",         "admitted_at": "2026-04-04 12:00", "admitted_by": "Dr. Michael Chen"},
    {"id": 21, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-07",  "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 22, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-08",  "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 23, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-09",  "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 24, "ward_id": 3, "ward": "General Emergency","bed_no": "GEN-10",  "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},

    # Trauma Unit (ward 4)
    {"id": 25, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-01", "status": "occupied", "patient": "Jane Smith",    "condition": "Critical — Multiple Trauma",        "admitted_at": "2026-04-04 01:20", "admitted_by": "Dr. Robert Martinez"},
    {"id": 26, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-02", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 27, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-03", "status": "occupied", "patient": "Victor Stone",  "condition": "Severe — Spinal Injury",           "admitted_at": "2026-04-03 19:00", "admitted_by": "Dr. Michael Chen"},
    {"id": 28, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-04", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 29, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-05", "status": "reserved", "patient": "Lana Kane",     "condition": "Moderate — Burn Injuries",         "admitted_at": "2026-04-04 11:45", "admitted_by": "Dr. Priya Sharma"},
    {"id": 30, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-06", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 31, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-07", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
    {"id": 32, "ward_id": 4, "ward": "Trauma Unit",      "bed_no": "TRMA-08", "status": "available","patient": None,            "condition": None,                               "admitted_at": None,               "admitted_by": None},
]

EMERGENCY_REQUESTS = []


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
