from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

# ─── Mock Data ────────────────────────────────────────────────────────────────

TREATMENT_WARDS = [
    {"id": 1, "name": "General Medicine",   "short": "GEN",   "color": "#0ea5e9", "total_beds": 15},
    {"id": 2, "name": "Oncology Ward",      "short": "ONC",   "color": "#d946ef", "total_beds": 8},
    {"id": 3, "name": "Nephrology Unit",    "short": "NEPH",  "color": "#14b8a6", "total_beds": 6},
    {"id": 4, "name": "Orthopedics Ward",   "short": "ORTH",  "color": "#6366f1", "total_beds": 10},
]

TREATMENT_BEDS = [
    # General Medicine (ward 1)
    {"id": 1,  "ward_id": 1, "ward": "General Medicine", "bed_no": "GEN-01",  "status": "occupied", "patient": "John Doe",      "condition": "Severe Pneumonia", "admitted_at": "2026-04-18 10:30", "admitted_by": "Dr. Sarah Johnson"},
    {"id": 2,  "ward_id": 1, "ward": "General Medicine", "bed_no": "GEN-02",  "status": "available","patient": None,            "condition": None,               "admitted_at": None,               "admitted_by": None},
    {"id": 3,  "ward_id": 1, "ward": "General Medicine", "bed_no": "GEN-03",  "status": "occupied", "patient": "Mary Watson",   "condition": "Fever Evaluation", "admitted_at": "2026-04-19 14:15", "admitted_by": "Dr. Robert Martinez"},
    {"id": 4,  "ward_id": 1, "ward": "General Medicine", "bed_no": "GEN-04",  "status": "available","patient": None,            "condition": None,               "admitted_at": None,               "admitted_by": None},
    {"id": 5,  "ward_id": 1, "ward": "General Medicine", "bed_no": "GEN-05",  "status": "reserved", "patient": "Peter Parker",  "condition": "Viral Infection",  "admitted_at": "2026-04-20 09:00", "admitted_by": "Dr. Sarah Johnson"},
    {"id": 6,  "ward_id": 1, "ward": "General Medicine", "bed_no": "GEN-06",  "status": "available","patient": None,            "condition": None,               "admitted_at": None,               "admitted_by": None},
    # ... assuming we just need a few representative ones for mock data
    
    # Oncology (ward 2)
    {"id": 16, "ward_id": 2, "ward": "Oncology Ward",    "bed_no": "ONC-01",  "status": "occupied", "patient": "Grace Lee",     "condition": "Chemotherapy Cycle", "admitted_at": "2026-04-17 08:30", "admitted_by": "Dr. Michael Chen"},
    {"id": 17, "ward_id": 2, "ward": "Oncology Ward",    "bed_no": "ONC-02",  "status": "occupied", "patient": "Bob Wilson",    "condition": "Radiation Treatment", "admitted_at": "2026-04-19 11:10", "admitted_by": "Dr. Michael Chen"},
    {"id": 18, "ward_id": 2, "ward": "Oncology Ward",    "bed_no": "ONC-03",  "status": "available","patient": None,            "condition": None,               "admitted_at": None,               "admitted_by": None},
    
    # Nephrology (ward 3)
    {"id": 24, "ward_id": 3, "ward": "Nephrology Unit",  "bed_no": "NEPH-01", "status": "occupied", "patient": "Alice Brown",   "condition": "Dialysis Access",    "admitted_at": "2026-04-20 07:00", "admitted_by": "Dr. Priya Sharma"},
    {"id": 25, "ward_id": 3, "ward": "Nephrology Unit",  "bed_no": "NEPH-02", "status": "available","patient": None,            "condition": None,               "admitted_at": None,               "admitted_by": None},

    # Orthopedics (ward 4)
    {"id": 30, "ward_id": 4, "ward": "Orthopedics Ward", "bed_no": "ORTH-01", "status": "occupied", "patient": "Jane Smith",    "condition": "Hip Replacement",   "admitted_at": "2026-04-15 13:20", "admitted_by": "Dr. Robert Martinez"},
    {"id": 31, "ward_id": 4, "ward": "Orthopedics Ward", "bed_no": "ORTH-02", "status": "available","patient": None,            "condition": None,               "admitted_at": None,               "admitted_by": None},
    {"id": 32, "ward_id": 4, "ward": "Orthopedics Ward", "bed_no": "ORTH-03", "status": "reserved", "patient": "Bruce Wayne",   "condition": "ACL Surgery Prep",  "admitted_at": "2026-04-21 06:00", "admitted_by": "Dr. Robert Martinez"},
]

TREATMENT_REQUESTS = []


class AdmitRequest(BaseModel):
    bed_id: int
    patient_name: str
    condition: str
    admitted_by: str


class TreatmentRequest(BaseModel):
    patient_name: str
    condition: str
    referring_doctor: str
    contact_number: str
    ward_preference: Optional[str] = None


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/wards")
async def get_wards():
    result = []
    for ward in TREATMENT_WARDS:
        ward_beds = [b for b in TREATMENT_BEDS if b["ward_id"] == ward["id"]]
        # In a real system, we'd have all beds, here we'll dynamically size based on mock beds found, or just assume the 'total_beds' from ward definition
        available = sum(1 for b in ward_beds if b["status"] == "available")
        occupied  = sum(1 for b in ward_beds if b["status"] == "occupied")
        reserved  = sum(1 for b in ward_beds if b["status"] == "reserved")
        
        # Override available calculation to respect total_beds if we haven't mocked them all
        mocked_beds_count = available + occupied + reserved
        unmocked_beds = max(0, ward["total_beds"] - mocked_beds_count)
        available += unmocked_beds

        result.append({
            **ward,
            "available_beds": available,
            "occupied_beds":  occupied,
            "reserved_beds":  reserved,
            "occupancy_pct":  round((occupied + reserved) / ward["total_beds"] * 100) if ward["total_beds"] > 0 else 0,
        })
    return result


@router.get("/beds")
async def get_beds(ward_id: Optional[int] = None, status: Optional[str] = None):
    # Dynamically generate missing beds to match 'total_beds' for mock data completeness
    full_beds = list(TREATMENT_BEDS)
    
    for ward in TREATMENT_WARDS:
        ward_id_val = ward["id"]
        existing_beds = [b for b in full_beds if b["ward_id"] == ward_id_val]
        
        # Add 'available' beds up to the total_beds count if missing
        if len(existing_beds) < ward["total_beds"]:
            start_idx = len(existing_beds) + 1
            max_id = max([b["id"] for b in full_beds] + [0])
            for i in range(start_idx, ward["total_beds"] + 1):
                max_id += 1
                bed_no_str = f"{ward['short']}-{i:02d}"
                full_beds.append({
                    "id": max_id,
                    "ward_id": ward_id_val,
                    "ward": ward["name"],
                    "bed_no": bed_no_str,
                    "status": "available",
                    "patient": None,
                    "condition": None,
                    "admitted_at": None,
                    "admitted_by": None
                })
    
    result = full_beds
    if ward_id:
        result = [b for b in result if b["ward_id"] == ward_id]
    if status:
        result = [b for b in result if b["status"] == status]
    return result


@router.get("/summary")
async def get_summary():
    # we need the same dynamic bed logic for summary
    wards_summary = await get_wards()
    total = sum(w["total_beds"] for w in wards_summary)
    available = sum(w["available_beds"] for w in wards_summary)
    occupied = sum(w["occupied_beds"] for w in wards_summary)
    reserved = sum(w["reserved_beds"] for w in wards_summary)

    return {
        "total_beds": total,
        "available":  available,
        "occupied":   occupied,
        "reserved":   reserved,
        "occupancy_pct": round((occupied + reserved) / total * 100) if total > 0 else 0,
        "pending_requests": len(TREATMENT_REQUESTS),
    }


@router.post("/beds/{bed_id}/admit")
async def admit_patient(bed_id: int, body: AdmitRequest):
    # In full mocking, we should check the actual list or dynamically generated ones, 
    # but since this is mock data, we will just simulate success if bed not in list yet
    for bed in TREATMENT_BEDS:
        if bed["id"] == bed_id:
            if bed["status"] == "occupied":
                raise HTTPException(status_code=409, detail="Bed is already occupied.")
            bed["status"]      = "occupied"
            bed["patient"]     = body.patient_name
            bed["condition"]   = body.condition
            bed["admitted_by"] = body.admitted_by
            bed["admitted_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
            return {"message": f"Patient '{body.patient_name}' admitted to {bed['bed_no']}", "bed": bed}
    
    # If bed wasn't in static list, we append it to simulate dynamic creation status
    for w in TREATMENT_WARDS:
         # Simplified for mock: just add it to the generic static list
         TREATMENT_BEDS.append({
             "id": bed_id,
             "ward_id": 1, # Mock default
             "ward": "Unknown",
             "bed_no": f"BED-{bed_id}",
             "status": "occupied",
             "patient": body.patient_name,
             "condition": body.condition,
             "admitted_by": body.admitted_by,
             "admitted_at": datetime.now().strftime("%Y-%m-%d %H:%M")
         })
         return {"message": f"Patient '{body.patient_name}' admitted successfully."}

    raise HTTPException(status_code=404, detail="Bed not found.")


@router.post("/beds/{bed_id}/discharge")
async def discharge_patient(bed_id: int):
    for bed in TREATMENT_BEDS:
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
async def request_treatment(body: TreatmentRequest):
    req_id = len(TREATMENT_REQUESTS) + 1
    new_req = {
        "id":              req_id,
        "patient_name":    body.patient_name,
        "condition":       body.condition,
        "referring_doctor":body.referring_doctor,
        "contact_number":  body.contact_number,
        "ward_preference": body.ward_preference,
        "status":          "pending",
        "submitted_at":    datetime.now().strftime("%Y-%m-%d %H:%M"),
        "estimated_wait":  "1-2 days based on bed availability",
    }
    TREATMENT_REQUESTS.append(new_req)
    return {
        "message":        "Treatment bed application submitted successfully.",
        "request_id":     req_id,
        "estimated_wait": new_req["estimated_wait"],
        "request":        new_req,
    }


@router.get("/requests")
async def get_requests(status: Optional[str] = None):
    result = TREATMENT_REQUESTS
    if status:
        result = [r for r in result if r["status"] == status]
    return result
