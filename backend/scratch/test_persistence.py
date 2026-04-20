import requests
import json
import os
import time

API_URL = "http://localhost:8000/api/v1"
DB_FILE = "d:/Projects/Hospitality/backend/app/db/db.json"

def test_registration_persistence():
    # 1. Register a new doctor
    timestamp = int(time.time())
    email = f"test_doc_{timestamp}@hospital.com"
    data = {
        "name": "Test Persist Doctor",
        "email": email,
        "password": "password123",
        "role": "doctor"
    }
    
    print(f"Registering doctor: {email}")
    response = requests.post(f"{API_URL}/auth/register", json=data)
    
    if response.status_code == 201:
        print("Registration successful!")
        # 2. Check if db.json was created/updated
        if os.path.exists(DB_FILE):
            print("db.json found!")
            with open(DB_FILE, "r") as f:
                db_data = json.load(f)
                patients = db_data.get("registered_patients", [])
                found = any(p["email"] == email for p in patients)
                if found:
                    print("Doctor found in db.json! Persistence working.")
                else:
                    print("Doctor NOT found in db.json.")
        else:
            print("db.json NOT found.")
    else:
        print(f"Registration failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_registration_persistence()
