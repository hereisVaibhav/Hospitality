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

from app.db.mock_data import MOCK_APPOINTMENTS, save_data



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
    save_data()
    return {"message": "Appointment booked successfully", "appointment": new_appt}


@router.patch("/{appointment_id}")
async def update_appointment(appointment_id: int, update: AppointmentUpdate):
    for appt in MOCK_APPOINTMENTS:
        if appt["id"] == appointment_id:
            if update.status:
                appt["status"] = update.status
            if update.notes is not None:
                appt["notes"] = update.notes
            save_data()
            return {"message": "Appointment updated successfully", "appointment": appt}
    raise HTTPException(status_code=404, detail="Appointment not found")


@router.delete("/{appointment_id}")
async def cancel_appointment(appointment_id: int):
    for appt in MOCK_APPOINTMENTS:
        if appt["id"] == appointment_id:
            appt["status"] = "cancelled"
            save_data()
            return {"message": "Appointment cancelled successfully", "appointment": appt}
    raise HTTPException(status_code=404, detail="Appointment not found")
