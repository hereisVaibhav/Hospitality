from typing import List, Dict, Any
import json
import os

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DB_DIR, "db.json")

# Centralized Registries
REGISTERED_PATIENTS: List[Dict[str, Any]] = []
MOCK_STAFF: List[Dict[str, Any]] = []
MOCK_APPOINTMENTS: List[Dict[str, Any]] = []
MOCK_PATIENTS: List[Dict[str, Any]] = []
MOCK_PRESCRIPTIONS: List[Dict[str, Any]] = []
WARDS: List[Dict[str, Any]] = []
BEDS: List[Dict[str, Any]] = []
EMERGENCY_REQUESTS: List[Dict[str, Any]] = []

def save_data():
    """Save all mock data to a JSON file."""
    try:
        data = {
            "registered_patients": REGISTERED_PATIENTS,
            "mock_staff": MOCK_STAFF,
            "mock_appointments": MOCK_APPOINTMENTS,
            "mock_patients": MOCK_PATIENTS,
            "mock_prescriptions": MOCK_PRESCRIPTIONS,
            "wards": WARDS,
            "beds": BEDS,
            "emergency_requests": EMERGENCY_REQUESTS
        }
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"Error saving data: {e}")

def load_data():
    """Load all mock data from a JSON file, falling back to defaults if file missing."""
    global REGISTERED_PATIENTS, MOCK_STAFF, MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_PRESCRIPTIONS, WARDS, BEDS, EMERGENCY_REQUESTS
    
    # Default data for fresh start
    DEFAULT_STAFF = [
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
    
    DEFAULT_PATIENTS = [
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

    DEFAULT_APPOINTMENTS = [
        {"id": 1, "patient": "John Doe", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-20", "time": "09:00 AM", "status": "completed", "notes": "Routine checkup completed. Vitals normal."},
        {"id": 2, "patient": "Jane Smith", "doctor": "Dr. Sarah Johnson", "department": "Cardiology", "date": "2026-04-20", "time": "10:30 AM", "status": "completed", "notes": "ECG performed, results normal."},
        {"id": 3, "patient": "Bob Wilson", "doctor": "Dr. Michael Chen", "department": "Neurology", "date": "2026-04-20", "time": "11:00 AM", "status": "in-progress", "notes": ""},
        {"id": 10, "patient": "Harry Potter", "doctor": "Dr. Sarah Johnson", "department": "Cardiology", "date": "2026-04-22", "time": "02:00 PM", "status": "booked", "notes": ""},
    ]

    DEFAULT_WARDS = [
        {"id": 1, "name": "Cardiac ICU",      "short": "CICU",  "color": "#ef4444", "total_beds": 8},
        {"id": 2, "name": "Neuro ICU",         "short": "NICU",  "color": "#8b5cf6", "total_beds": 6},
        {"id": 3, "name": "General Emergency", "short": "GEN",   "color": "#f59e0b", "total_beds": 10},
        {"id": 4, "name": "Trauma Unit",       "short": "TRMA",  "color": "#06b6d4", "total_beds": 8},
    ]

    DEFAULT_BEDS = [
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
        {"id": 13, "ward_id": 2, "ward": "Neuro ICU",        "bed_no": "NICU-05", "status": "occupied", "patient": "Eve Adams",     "condition": "Stable — Seizure Monitoring",      "admitted_at": "2026-04-04 06:00", "admitted_by": "Dr. Michael Chen"},
    ]

    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
                REGISTERED_PATIENTS.clear()
                REGISTERED_PATIENTS.extend(data.get("registered_patients", []))
                
                MOCK_STAFF.clear()
                MOCK_STAFF.extend(data.get("mock_staff", DEFAULT_STAFF))
                
                MOCK_APPOINTMENTS.clear()
                MOCK_APPOINTMENTS.extend(data.get("mock_appointments", DEFAULT_APPOINTMENTS))
                
                MOCK_PATIENTS.clear()
                MOCK_PATIENTS.extend(data.get("mock_patients", DEFAULT_PATIENTS))
                
                MOCK_PRESCRIPTIONS.clear()
                MOCK_PRESCRIPTIONS.extend(data.get("mock_prescriptions", []))
                
                WARDS.clear()
                WARDS.extend(data.get("wards", DEFAULT_WARDS))
                
                BEDS.clear()
                BEDS.extend(data.get("beds", DEFAULT_BEDS))
                
                EMERGENCY_REQUESTS.clear()
                EMERGENCY_REQUESTS.extend(data.get("emergency_requests", []))
        except Exception as e:
            print(f"Error loading data: {e}")
    else:
        # Initial seeding
        REGISTERED_PATIENTS.clear()
        MOCK_STAFF.extend(DEFAULT_STAFF)
        MOCK_PATIENTS.extend(DEFAULT_PATIENTS)
        MOCK_APPOINTMENTS.extend(DEFAULT_APPOINTMENTS)
        WARDS.extend(DEFAULT_WARDS)
        BEDS.extend(DEFAULT_BEDS)
        save_data()

# Initial load
load_data()
