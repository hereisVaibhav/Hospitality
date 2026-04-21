import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser]           = useState(null);
    const [profile, setProfile]     = useState(null);
    const [loading, setLoading]     = useState(true);

    useEffect(() => {
        const savedUser    = localStorage.getItem('user');
        const savedProfile = localStorage.getItem('patientProfile');
        if (savedUser)    setUser(JSON.parse(savedUser));
        if (savedProfile) setProfile(JSON.parse(savedProfile));
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // MOCK LOGIN FOR DEMO
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true' || true) {
            console.log('Demo Mode: Simulating login success');
            const mockUser = {
                id: 'demo-1',
                email: email,
                name: email.split('@')[0].toUpperCase(),
                role: email.includes('admin') ? 'admin' : (email.includes('doctor') ? 'doctor' : 'patient')
            };
            const mockProfile = {
                id: 'prof-1',
                fullName: mockUser.name,
                email: email
            };

            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('patientProfile', JSON.stringify(mockProfile));
            setUser(mockUser);
            setProfile(mockProfile);
            return { success: true };
        }

        try {
            const response = await api.post('/auth/login', { email, password });
            const { access_token, user: userData, profile: profileData } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            if (profileData) {
                localStorage.setItem('patientProfile', JSON.stringify(profileData));
                setProfile(profileData);
            }
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: error.response?.data?.detail || 'Login failed. Check your credentials.' };
        }
    };

    const register = async (formData) => {
        // MOCK REGISTER FOR DEMO
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true' || true) {
            console.log('Demo Mode: Simulating registration success');
            const mockUser = { id: 'demo-2', email: formData.email, name: formData.fullName, role: 'patient' };
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);
            return { success: true };
        }

        try {
            const response = await api.post('/auth/register', formData);
            const { access_token, user: userData, profile: profileData } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('patientProfile', JSON.stringify(profileData));
            setUser(userData);
            setProfile(profileData);
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, message: error.response?.data?.detail || 'Registration failed. Please try again.' };
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('patientProfile');
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, profile, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
