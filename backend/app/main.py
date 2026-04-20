from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.api.v1.endpoints import auth, staff, departments, appointments, reports, patients, prescriptions, emergency, treatment
app = FastAPI(title="Hospitality Management System API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(staff.router, prefix="/api/v1/staff", tags=["Staff"])
app.include_router(departments.router, prefix="/api/v1/departments", tags=["Departments"])
app.include_router(appointments.router, prefix="/api/v1/appointments", tags=["Appointments"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(patients.router, prefix="/api/v1/patients", tags=["Patients"])
app.include_router(prescriptions.router, prefix="/api/v1/prescriptions", tags=["Prescriptions"])
app.include_router(emergency.router, prefix="/api/v1/emergency", tags=["Emergency"])
app.include_router(treatment.router, prefix="/api/v1/treatment", tags=["Treatment Wards"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Hospitality Management System API", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
