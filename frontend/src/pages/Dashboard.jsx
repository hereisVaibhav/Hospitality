import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';
import LoadingScreen from '../components/LoadingScreen';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen message="Accessing your dashboard..." />;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const role = user.role?.toLowerCase();

    if (role === 'admin') {
        return <AdminDashboard />;
    } else if (role === 'doctor') {
        return <DoctorDashboard />;
    } else {
        return <PatientDashboard />;
    }
};

export default Dashboard;
