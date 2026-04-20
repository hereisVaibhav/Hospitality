import urllib.request
import json

BASE_URL = "http://localhost:8000/api/v1"

def post_json(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'))
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req) as response:
        return response.getcode(), json.loads(response.read().decode('utf-8'))

def get_json(url):
    with urllib.request.urlopen(url) as response:
        return response.getcode(), json.loads(response.read().decode('utf-8'))

def test_login_doctor_chen():
    print("Testing Dr. Michael Chen Login...")
    payload = {
        "email": "m.chen@hospital.com",
        "password": "password123"
    }
    try:
        code, data = post_json(f"{BASE_URL}/auth/login", payload)
        if code == 200:
            print(f"Success! Welcome, {data['user']['name']}")
            
            # Test fetching his appointments
            doctor_name = urllib.parse.quote(data['user']['name'])
            a_code, appts = get_json(f"{BASE_URL}/appointments?doctor={doctor_name}")
            if a_code == 200:
                print(f"Found {len(appts)} appointments for {data['user']['name']}:")
                for a in appts:
                    print(f" - {a['patient']} at {a['time']} ({a['status']})")
        else:
            print(f"Login failed: {code}")
    except Exception as e:
        print(f"Error during Chen login: {e}")

def test_login_doctor_johnson():
    print("\nTesting Dr. Sarah Johnson Login...")
    payload = {
        "email": "sarah.j@hospital.com",
        "password": "password123"
    }
    try:
        code, data = post_json(f"{BASE_URL}/auth/login", payload)
        if code == 200:
            print(f"Success! Welcome, {data['user']['name']}")
            
            # Test fetching her appointments
            doctor_name = urllib.parse.quote(data['user']['name'])
            a_code, appts = get_json(f"{BASE_URL}/appointments?doctor={doctor_name}")
            if a_code == 200:
                print(f"Found {len(appts)} appointments for {data['user']['name']}:")
                for a in appts:
                    print(f" - {a['patient']} at {a['time']} ({a['status']})")
        else:
            print(f"Login failed: {code}")
    except Exception as e:
        print(f"Error during Johnson login: {e}")

if __name__ == "__main__":
    test_login_doctor_chen()
    test_login_doctor_johnson()
