import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demo purposes
const MOCK_DATA = {
  '/appointments': [
    { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', date: new Date().toISOString().split('T')[0], time: '10:00 AM', status: 'booked' },
    { id: 2, patient: 'Jane Smith', doctor: 'Dr. Smith', date: new Date().toISOString().split('T')[0], time: '11:30 AM', status: 'in-progress' },
  ],
  '/emergency/summary': {
    available: 5,
    total_beds: 20,
    occupied: 15,
    occupancy_pct: 75
  },
  '/patients': [
    { id: 1, name: 'John Doe', email: 'john@example.com', admission_status: 'admitted' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', admission_status: 'outpatient' },
  ],
  '/staff': [
    { id: 1, name: 'Dr. Sarah Johnson', role: 'doctor', department: 'Cardiology', email: 'sarah@hospital.com', phone: '+1-555-0101', status: 'active' },
    { id: 2, name: 'Dr. Mark Wilson', role: 'doctor', department: 'Neurology', email: 'mark@hospital.com', phone: '+1-555-0102', status: 'active' },
    { id: 3, name: 'Nurse Emily Brown', role: 'nurse', department: 'Emergency', email: 'emily@hospital.com', phone: '+1-555-0103', status: 'on-leave' },
  ]
};

// Add a request interceptor to include the JWT token in the header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for Demo Mode fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;
    if (!config) return Promise.reject(error);

    const url = config.url.split('?')[0].replace(api.defaults.baseURL, '');
    const method = config.method;

    // Handle GET requests
    if (method === 'get') {
      const mockResponse = MOCK_DATA[url] || MOCK_DATA[Object.keys(MOCK_DATA).find(k => url.startsWith(k))];
      if (mockResponse) {
        console.warn(`API GET fallback for ${url}`);
        return Promise.resolve({ data: mockResponse, status: 200 });
      }
    }

    // Handle POST requests for Demo Mode
    if (method === 'post') {
      if (url === '/staff' || url === '/auth/login' || url === '/auth/register') {
        console.warn(`API POST simulated success for ${url}`);
        const data = JSON.parse(config.data || '{}');
        // Return back what was sent + a mock ID
        return Promise.resolve({ 
          data: { 
            success: true, 
            staff: { ...data, id: Date.now(), status: 'active' },
            user: { ...data, id: 'demo-u' },
            access_token: 'demo-token'
          }, 
          status: 200 
        });
      }
    }

    // Handle DELETE requests
    if (method === 'delete') {
      console.warn(`API DELETE simulated success for ${url}`);
      return Promise.resolve({ data: { success: true }, status: 200 });
    }

    return Promise.reject(error);
  }
);


export default api;

