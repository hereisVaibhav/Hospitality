# Project Overview: Hospitality Management System

This document outlines the core technologies and languages used in this project, as well as instructions on how to start the development environment.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React with Vite
- **Language**: JavaScript/JSX
- **Routing**: React Router DOM (`react-router-dom`)
- **HTTP Client**: Axios (`axios`)
- **Icons**: Lucide React (`lucide-react`)
- **Styling**: Vanilla CSS (Premium aesthetics with dark mode, glassmorphism)

### Backend
- **Framework**: FastAPI (Python)
- **Database ORM**: SQLAlchemy / SQLModel
- **Authentication**: JWT-based auth

### Database & Deployment
- **Database**: Neon Postgres (PostgreSQL)
- **Deployment Platform**: Render

---

## 🚀 How to Start the Project

### 1. Starting the Backend (FastAPI)

Open a new terminal and run the following commands:

```bash
# Navigate to the backend directory
cd backend

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install any dependencies (if applicable)
# pip install -r requirements.txt

# Start the FastAPI development server
uvicorn app.main:app --reload
```
The backend server will typically be available at `http://127.0.0.1:8000`. You can view the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 2. Starting the Frontend (React + Vite)

Open a separate terminal and run the following commands:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (only required the first time or when dependencies change)
npm install

# Start the Vite development server
npm run dev
```
The frontend application will compile and provide a local URL (usually `http://localhost:5173`) in the terminal. Open that URL in your browser to view the application.
