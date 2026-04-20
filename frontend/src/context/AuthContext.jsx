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
