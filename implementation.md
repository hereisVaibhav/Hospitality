# Hospitality Management System Implementation Plan

This plan outlines the development of a comprehensive Hospital Management System using **React** (Frontend), **FastAPI** (Backend), **Neon** (Postgres Database), and **Render** (Deployment).

## Proposed Changes

### Database Layer (Neon Postgres)
- **Tables**:
  - `users`: ID, name, email, password_hash, role (admin, doctor, patient).
  - `doctors`: user_id, specialization, department_id, availability_slots.
  - `patients`: user_id, medical_history_summary.
  - `departments`: ID, name, head_doctor_id.
  - `appointments`: ID, patient_id, doctor_id, date, status (booked, cancelled, completed), diagnosis_notes.
  - `prescriptions`: ID, appointment_id, doctor_id, patient_id, medicine_details, date.
  - `rooms`: ID, type (ICU, General, Private), capacity, occupied_count.
  - `admissions`: ID, patient_id, room_id, admission_date, discharge_date, status.

### Backend Layer (FastAPI)
- **Structure**:
  - `app/main.py`: Entry point.
  - `app/api/v1/endpoints/`:
    - `auth.py`: JWT-based login, registration.
    - `patient.py`: Profile, appointment booking, viewing history.
    - `doctor.py`: Appointment management, prescription uploads.
    - `admin.py`: Staff management, department setup, system analytics.
    - `appointment.py`: Availability checks, reminders logic.
    - `admission.py`: Room tracking, admission/discharge.
  - `app/db/`: Session management and models (SQLAlchemy/SQLModel).
  - `app/schemas/`: Pydantic models for request/response validation.
  - `app/core/`: Security, configuration, constants.

### Frontend Layer (React with Vite)
- **Structure**:
  - `src/components/`: Reusable UI elements (Buttons, Inputs, Modals, Navbar).
  - `src/pages/`:
    - `Home`: Overview, services, specializations.
    - `Auth`: Login/Register for different roles.
    - `PatientDashboard`: Book/view appointments, prescriptions, medical history.
    - `DoctorDashboard`: Manage appointments, diagnosis, schedule.
    - `AdminDashboard`: Manage staff, departments, view reports.
  - `src/services/`: API client (Axios) for backend communication.
  - `src/context/`: Authentication and Global State.
  - `src/styles/`: Vanilla CSS with premium aesthetics (dark mode, glassmorphism).

