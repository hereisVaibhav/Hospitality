from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

router = APIRouter()

# All available time slots in a day
ALL_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM",
    "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
    "04:30 PM", "05:00 PM"
]

MOCK_APPOINTMENTS = [
    {"id": 1, "patient": "John Doe", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-04", "time": "09:00 AM", "status": "completed", "notes": "Routine checkup completed. Vitals normal."},
    {"id": 2, "patient": "Jane Smith", "doctor": "Dr. Sarah Johnson", "department": "Cardiology", "date": "2026-04-04", "time": "10:30 AM", "status": "completed", "notes": "ECG performed, results normal."},
    {"id": 3, "patient": "Bob Wilson", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-04", "time": "11:00 AM", "status": "in-progress", "notes": ""},
    {"id": 4, "patient": "Alice Brown", "doctor": "Dr. Robert Martinez", "department": "Orthopedics", "date": "2026-04-05", "time": "02:00 PM", "status": "booked", "notes": ""},
    {"id": 5, "patient": "Charlie Davis", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-05", "time": "03:00 PM", "status": "booked", "notes": ""},
    {"id": 6, "patient": "Diana Prince", "doctor": "Dr. Priya Sharma", "department": "Dermatology", "date": "2026-04-05", "time": "03:30 PM", "status": "booked", "notes": ""},
    {"id": 7, "patient": "Eve Adams", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-06", "time": "09:00 AM", "status": "booked", "notes": ""},
    {"id": 8, "patient": "Frank Castle", "doctor": "Dr. Emily Davis", "department": "Pediatrics", "date": "2026-04-06", "time": "10:00 AM", "status": "cancelled", "notes": "Patient requested cancellation."},
    {"id": 9, "patient": "Grace Lee", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-06", "time": "11:00 AM", "status": "booked", "notes": ""},
    {"id": 10, "patient": "Harry Potter", "doctor": "Dr. Sarah Johnson", "department": "Cardiology", "date": "2026-04-06", "time": "02:00 PM", "status": "booked", "notes": ""},
]


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class AppointmentCreate(BaseModel):
    patient: str
    department: str
    doctor: str
    date: str
    time: str


@router.get("/")
async def get_appointments(doctor: Optional[str] = None, patient: Optional[str] = None, date_filter: Optional[str] = None):
    result = MOCK_APPOINTMENTS
    if doctor:
        result = [a for a in result if a["doctor"].lower() == doctor.lower()]
    if patient:
        result = [a for a in result if a["patient"].lower() == patient.lower()]
    if date_filter:
        result = [a for a in result if a["date"] == date_filter]
    return result


@router.get("/available-slots")
async def get_available_slots(doctor: str, date: str):
    """
    Returns all time slots for a given doctor on a given date.
    Each slot includes whether it is available or already booked.
    """
    # Find all active (non-cancelled) bookings for this doctor on this date
    booked_times = {
        a["time"]
        for a in MOCK_APPOINTMENTS
        if a["doctor"].lower() == doctor.lower()
        and a["date"] == date
        and a["status"] != "cancelled"
    }

    slots = []
    for slot in ALL_SLOTS:
        slots.append({
            "time": slot,
            "available": slot not in booked_times
        })

    return {
        "doctor": doctor,
        "date": date,
        "slots": slots,
        "total_available": sum(1 for s in slots if s["available"])
    }


@router.get("/today")
async def get_todays_appointments():
    today = date.today().isoformat()
    return [a for a in MOCK_APPOINTMENTS if a["date"] == today]


@router.post("/")
async def create_appointment(appt: AppointmentCreate):
    # Check if this doctor-date-time slot is already taken (conflict check)
    conflict = next(
        (a for a in MOCK_APPOINTMENTS
         if a["doctor"].lower() == appt.doctor.lower()
         and a["date"] == appt.date
         and a["time"] == appt.time
         and a["status"] != "cancelled"),
        None
    )
    if conflict:
        raise HTTPException(
            status_code=409,
            detail=f"This time slot ({appt.time}) is already booked with {appt.doctor} on {appt.date}. Please choose a different slot."
        )

    new_id = max(a["id"] for a in MOCK_APPOINTMENTS) + 1 if MOCK_APPOINTMENTS else 1
    new_appt = {
        "id": new_id,
        "patient": appt.patient,
        "doctor": appt.doctor,
        "department": appt.department,
        "date": appt.date,
        "time": appt.time,
        "status": "booked",
        "notes": ""
    }
    MOCK_APPOINTMENTS.append(new_appt)
    return {"message": "Appointment booked successfully", "appointment": new_appt}


@router.patch("/{appointment_id}")
async def update_appointment(appointment_id: int, update: AppointmentUpdate):
    for appt in MOCK_APPOINTMENTS:
        if appt["id"] == appointment_id:
            if update.status:
                appt["status"] = update.status
            if update.notes is not None:
                appt["notes"] = update.notes
            return {"message": "Appointment updated successfully", "appointment": appt}
    raise HTTPException(status_code=404, detail="Appointment not found")


@router.delete("/{appointment_id}")
async def cancel_appointment(appointment_id: int):
    for appt in MOCK_APPOINTMENTS:
        if appt["id"] == appointment_id:
            appt["status"] = "cancelled"
            return {"message": "Appointment cancelled successfully", "appointment": appt}
    raise HTTPException(status_code=404, detail="Appointment not found")
