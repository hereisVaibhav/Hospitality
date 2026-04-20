from typing import List, Dict, Any
import json
import os

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DB_DIR, "db.json")

# Mocked patient registry (dynamically updated patients)
REGISTERED_PATIENTS: List[Dict[str, Any]] = []

def save_data():
    """Save REGISTERED_PATIENTS to a JSON file."""
    try:
        with open(DB_FILE, "w") as f:
            json.dump({"registered_patients": REGISTERED_PATIENTS}, f, indent=4)
    except Exception as e:
        print(f"Error saving data: {e}")

def load_data():
    """Load REGISTERED_PATIENTS from a JSON file."""
    global REGISTERED_PATIENTS
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
                REGISTERED_PATIENTS.clear()
                REGISTERED_PATIENTS.extend(data.get("registered_patients", []))
        except Exception as e:
            print(f"Error loading data: {e}")

# Initial load
load_data()

# Centralized Staff Registry
MOCK_STAFF: List[Dict[str, Any]] = [
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

# Centralized Appointments
MOCK_APPOINTMENTS: List[Dict[str, Any]] = [
    {"id": 1, "patient": "John Doe", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-20", "time": "09:00 AM", "status": "completed", "notes": "Routine checkup completed. Vitals normal."},
    {"id": 2, "patient": "Jane Smith", "doctor": "Dr. Sarah Johnson", "department": "Cardiology", "date": "2026-04-20", "time": "10:30 AM", "status": "completed", "notes": "ECG performed, results normal."},
    {"id": 3, "patient": "Bob Wilson", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-20", "time": "11:00 AM", "status": "in-progress", "notes": ""},
    {"id": 4, "patient": "Alice Brown", "doctor": "Dr. Robert Martinez", "department": "Orthopedics", "date": "2026-04-21", "time": "02:00 PM", "status": "booked", "notes": ""},
    {"id": 5, "patient": "Charlie Davis", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-21", "time": "03:00 PM", "status": "booked", "notes": ""},
    {"id": 6, "patient": "Diana Prince", "doctor": "Dr. Priya Sharma", "department": "Dermatology", "date": "2026-04-21", "time": "03:30 PM", "status": "booked", "notes": ""},
    {"id": 7, "patient": "Eve Adams", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-22", "time": "09:00 AM", "status": "booked", "notes": ""},
    {"id": 8, "patient": "Frank Castle", "doctor": "Dr. Emily Davis", "department": "Pediatrics", "date": "2026-04-22", "time": "10:00 AM", "status": "cancelled", "notes": "Patient requested cancellation."},
    {"id": 9, "patient": "Grace Lee", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-22", "time": "11:00 AM", "status": "booked", "notes": ""},
    {"id": 10, "patient": "Harry Potter", "doctor": "Dr. Sarah Johnson", "department": "Cardiology", "date": "2026-04-22", "time": "02:00 PM", "status": "booked", "notes": ""},
]

# Centralized Patient Profiles
MOCK_PATIENTS: List[Dict[str, Any]] = [
    {"id": 1, "name": "John Doe", "age": 45, "gender": "Male", "blood_group": "O+", "phone": "+1-555-1001", "email": "john.doe@email.com", "assigned_doctor": "Dr. Michael Chen", "medical_history": "Hypertension, Type 2 Diabetes", "admission_status": "outpatient"},
    {"id": 2, "name": "Bob Wilson", "age": 62, "gender": "Male", "blood_group": "A-", "phone": "+1-555-1003", "email": "bob.wilson@email.com", "assigned_doctor": "Dr. Michael Chen", "medical_history": "Chronic migraines, Vertigo", "admission_status": "admitted"},
    {"id": 3, "name": "Charlie Davis", "age": 34, "gender": "Male", "blood_group": "B+", "phone": "+1-555-1005", "email": "charlie.d@email.com", "assigned_doctor": "Dr. Michael Chen", "medical_history": "Epilepsy — well controlled", "admission_status": "outpatient"},
    {"id": 4, "name": "Eve Adams", "age": 28, "gender": "Female", "blood_group": "AB+", "phone": "+1-555-1007", "email": "eve.adams@email.com", "assigned_doctor": "Dr. Michael Chen", "medical_history": "Anxiety disorder, Insomnia", "admission_status": "outpatient"},
    {"id": 5, "name": "Grace Lee", "age": 51, "gender": "Female", "blood_group": "O-", "phone": "+1-555-1009", "email": "grace.lee@email.com", "assigned_doctor": "Dr. Michael Chen", "medical_history": "Multiple sclerosis", "admission_status": "admitted"},
    {"id": 6, "name": "Jane Smith", "age": 38, "gender": "Female", "blood_group": "A+", "phone": "+1-555-1002", "email": "jane.smith@email.com", "assigned_doctor": "Dr. Sarah Johnson", "medical_history": "Arrhythmia", "admission_status": "outpatient"},
    {"id": 7, "name": "Alice Brown", "age": 56, "gender": "Female", "blood_group": "B-", "phone": "+1-555-1004", "email": "alice.brown@email.com", "assigned_doctor": "Dr. Robert Martinez", "medical_history": "Knee replacement recovery", "admission_status": "admitted"},
    {"id": 8, "name": "Diana Prince", "age": 29, "gender": "Female", "blood_group": "AB-", "phone": "+1-555-1006", "email": "diana.p@email.com", "assigned_doctor": "Dr. Priya Sharma", "medical_history": "Eczema, Psoriasis", "admission_status": "outpatient"},
    {"id": 9, "name": "Frank Castle", "age": 41, "gender": "Male", "blood_group": "O+", "phone": "+1-555-1008", "email": "frank.c@email.com", "assigned_doctor": "Dr. Emily Davis", "medical_history": "Asthma, seasonal allergies", "admission_status": "outpatient"},
    {"id": 10, "name": "Harry Potter", "age": 33, "gender": "Male", "blood_group": "A+", "phone": "+1-555-1010", "email": "harry.p@email.com", "assigned_doctor": "Dr. Sarah Johnson", "medical_history": "Chest pain evaluation", "admission_status": "outpatient"},
]

# Centralized Prescriptions
MOCK_PRESCRIPTIONS: List[Dict[str, Any]] = [
    {"id": 1, "patient": "John Doe", "doctor": "Dr. Michael Chen", "date": "2026-03-15", "medicines": "Amlodipine 5mg, Metformin 500mg", "dosage": "Once daily after meals", "notes": "Monitor blood pressure weekly. Follow up in 30 days."},
    {"id": 2, "patient": "Bob Wilson", "doctor": "Dr. Michael Chen", "date": "2026-03-14", "medicines": "Sumatriptan 50mg", "dosage": "As needed for migraine onset, max 2 per day", "notes": "Avoid triggers: bright lights, stress. MRI scheduled for next visit."},
    {"id": 3, "patient": "Charlie Davis", "doctor": "Dr. Michael Chen", "date": "2026-03-13", "medicines": "Levetiracetam 500mg", "dosage": "Twice daily", "notes": "Seizure-free for 6 months. Continue current regimen."},
    {"id": 4, "patient": "Jane Smith", "doctor": "Dr. Sarah Johnson", "date": "2026-03-15", "medicines": "Flecainide 100mg", "dosage": "Twice daily", "notes": "Holter monitor results pending."},
    {"id": 5, "patient": "Eve Adams", "doctor": "Dr. Michael Chen", "date": "2026-03-12", "medicines": "Sertraline 50mg, Zolpidem 5mg", "dosage": "Sertraline: morning, Zolpidem: bedtime as needed", "notes": "Follow-up in 2 weeks to assess response."},
]
