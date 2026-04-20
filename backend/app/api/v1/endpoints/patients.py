from fastapi import APIRouter
from typing import Optional

router = APIRouter()

MOCK_PATIENTS = [
    {"id": 1, "name": "John Doe", "age": 45, "gender": "Male", "blood_group": "O+", "phone": "+1-555-1001", "email": "john.doe@email.com", "assigned_doctor": "Dr. Smith", "medical_history": "Hypertension, Type 2 Diabetes", "admission_status": "outpatient"},
    {"id": 2, "name": "Bob Wilson", "age": 62, "gender": "Male", "blood_group": "A-", "phone": "+1-555-1003", "email": "bob.wilson@email.com", "assigned_doctor": "Dr. Smith", "medical_history": "Chronic migraines, Vertigo", "admission_status": "admitted"},
    {"id": 3, "name": "Charlie Davis", "age": 34, "gender": "Male", "blood_group": "B+", "phone": "+1-555-1005", "email": "charlie.d@email.com", "assigned_doctor": "Dr. Smith", "medical_history": "Epilepsy — well controlled", "admission_status": "outpatient"},
    {"id": 4, "name": "Eve Adams", "age": 28, "gender": "Female", "blood_group": "AB+", "phone": "+1-555-1007", "email": "eve.adams@email.com", "assigned_doctor": "Dr. Smith", "medical_history": "Anxiety disorder, Insomnia", "admission_status": "outpatient"},
    {"id": 5, "name": "Grace Lee", "age": 51, "gender": "Female", "blood_group": "O-", "phone": "+1-555-1009", "email": "grace.lee@email.com", "assigned_doctor": "Dr. Smith", "medical_history": "Multiple sclerosis", "admission_status": "admitted"},
    {"id": 6, "name": "Jane Smith", "age": 38, "gender": "Female", "blood_group": "A+", "phone": "+1-555-1002", "email": "jane.smith@email.com", "assigned_doctor": "Dr. Sarah Johnson", "medical_history": "Arrhythmia", "admission_status": "outpatient"},
    {"id": 7, "name": "Alice Brown", "age": 56, "gender": "Female", "blood_group": "B-", "phone": "+1-555-1004", "email": "alice.brown@email.com", "assigned_doctor": "Dr. Robert Martinez", "medical_history": "Knee replacement recovery", "admission_status": "admitted"},
    {"id": 8, "name": "Diana Prince", "age": 29, "gender": "Female", "blood_group": "AB-", "phone": "+1-555-1006", "email": "diana.p@email.com", "assigned_doctor": "Dr. Priya Sharma", "medical_history": "Eczema, Psoriasis", "admission_status": "outpatient"},
    {"id": 9, "name": "Frank Castle", "age": 41, "gender": "Male", "blood_group": "O+", "phone": "+1-555-1008", "email": "frank.c@email.com", "assigned_doctor": "Dr. Emily Davis", "medical_history": "Asthma, seasonal allergies", "admission_status": "outpatient"},
    {"id": 10, "name": "Harry Potter", "age": 33, "gender": "Male", "blood_group": "A+", "phone": "+1-555-1010", "email": "harry.p@email.com", "assigned_doctor": "Dr. Sarah Johnson", "medical_history": "Chest pain evaluation", "admission_status": "outpatient"},
]


@router.get("/")
async def get_patients(doctor: Optional[str] = None, name: Optional[str] = None):
    result = MOCK_PATIENTS
    if doctor:
        result = [p for p in result if p["assigned_doctor"].lower() == doctor.lower()]
    if name:
        result = [p for p in result if p["name"].lower() == name.lower()]
    return result
