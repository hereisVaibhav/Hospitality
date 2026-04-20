from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

from app.db.mock_data import MOCK_STAFF, REGISTERED_PATIENTS

class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    # Account
    name: str
    email: str
    password: str
    role: str = "patient"  # patient | doctor
    # Personal
    age: Optional[int] = None
    date_of_birth: Optional[str] = None
    sex: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    blood_group: Optional[str] = None
    mobile: Optional[str] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    # Medical
    known_allergies: Optional[str] = None
    current_medications: Optional[str] = None
    medical_history: Optional[str] = None
    preferred_doctor: Optional[str] = None

@router.post("/login")
async def login(request: LoginRequest):
    # 1. Check Hardcoded/Common Logins (for convenience)
    if request.email == "admin@hospital.com" and request.password == "admin123":
        return {
            "access_token": "mocked_jwt_token_admin",
            "token_type": "bearer",
            "user": {"id": 1, "name": "Admin User", "role": "admin", "email": request.email}
        }
    
    # 2. Check MOCK_STAFF (Existing doctors, nurses, admins)
    for s in MOCK_STAFF:
        # For mock simplicity, we accept 'password123' or 'doctor123' for staff
        if s["email"] == request.email and request.password in ["password123", "doctor123"]:
            return {
                "access_token": f"mocked_jwt_token_staff_{s['id']}",
                "token_type": "bearer",
                "user": s
            }

    # 3. Check dynamic patient registrations
    for p in REGISTERED_PATIENTS:
        if p["email"] == request.email and p["password"] == request.password:
            return {
                "access_token": f"mocked_jwt_token_patient_{p['id']}",
                "token_type": "bearer",
                "user": {"id": p["id"], "name": p["name"], "role": "patient", "email": p["email"]},
                "profile": p,
            }
    
    # 4. Fallback for generic patient login
    if request.email == "patient@hospital.com" and request.password == "patient123":
         return {
            "access_token": "mocked_jwt_token_patient",
            "token_type": "bearer",
            "user": {"id": 3, "name": "John Doe", "role": "patient", "email": request.email}
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/register", status_code=201)
async def register(data: RegisterRequest):
    # Check duplicate email
    all_emails = [
        "admin@hospital.com", "doctor@hospital.com", "patient@hospital.com",
        *[s["email"] for s in MOCK_STAFF],
        *[p["email"] for p in REGISTERED_PATIENTS],
    ]
    if data.email in all_emails:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    new_id = 1000 + len(REGISTERED_PATIENTS) + 1
    patient_record = {
        "id":                      new_id,
        "name":                    data.name,
        "email":                   data.email,
        "password":                data.password,
        "role":                    data.role,
        "age":                     data.age,
        "date_of_birth":           data.date_of_birth,
        "sex":                     data.sex,
        "height_cm":               data.height_cm,
        "weight_kg":               data.weight_kg,
        "blood_group":             data.blood_group,
        "mobile":                  data.mobile,
        "address":                 data.address,
        "emergency_contact_name":  data.emergency_contact_name,
        "emergency_contact_phone": data.emergency_contact_phone,
        "known_allergies":         data.known_allergies,
        "current_medications":     data.current_medications,
        "medical_history":         data.medical_history,
        "preferred_doctor":        data.preferred_doctor,
        "admission_status":        "outpatient",
    }
    REGISTERED_PATIENTS.append(patient_record)

    return {
        "message":      "Registration successful!",
        "access_token": f"mocked_jwt_token_patient_{new_id}",
        "token_type":   "bearer",
        "user":         {"id": new_id, "name": data.name, "role": data.role, "email": data.email},
        "profile":      patient_record,
    }

