import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="fade-in" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
            Loading...
        </div>
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'admin') {
        return <AdminDashboard />;
    } else if (user.role === 'doctor') {
        return <DoctorDashboard />;
    } else {
        return <PatientDashboard />;
    }
};

export default Dashboard;
