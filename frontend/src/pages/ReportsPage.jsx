import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, UserPlus, BedDouble, Calendar, DollarSign, AlertTriangle, LogOut, Activity } from 'lucide-react';
import api from '../services/api';

const ReportsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/reports/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return <div className="fade-in" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading reports...</div>;
    }

    const statCards = [
        { label: 'Total Patients', value: stats.total_patients.toLocaleString(), icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { label: 'Active Doctors', value: stats.active_doctors, icon: UserPlus, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
        { label: 'Total Nurses', value: stats.total_nurses, icon: Activity, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
        { label: 'Bed Occupancy', value: `${stats.bed_occupancy}%`, icon: BedDouble, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        { label: "Today's Appointments", value: stats.appointments_today, icon: Calendar, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
        { label: 'Departments', value: stats.total_departments, icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
        { label: 'Monthly Revenue', value: `$${stats.revenue_this_month.toLocaleString()}`, icon: DollarSign, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
        { label: 'Pending Admissions', value: stats.pending_admissions, icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        { label: 'Discharged Today', value: stats.discharged_today, icon: LogOut, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
        { label: 'Emergency Cases', value: stats.emergency_cases, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    ];

    const { monthly_trends } = stats;
    const maxPatients = Math.max(...monthly_trends.patients);
    const maxAppts = Math.max(...monthly_trends.appointments);

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Analytics & <span style={{ color: 'var(--primary)' }}>Reports</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Hospital-wide statistics and performance metrics</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {statCards.map((card, i) => (
                    <div key={i} className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem' }}>
                        <div style={{ padding: '0.65rem', background: card.bg, borderRadius: '10px', flexShrink: 0 }}>
                            <card.icon size={22} color={card.color} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', lineHeight: 1 }}>{card.value}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trend Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div className="card glass">
                    <h2 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Patient Growth <span style={{ color: 'var(--primary)' }}>Trend</span></h2>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '180px' }}>
                        {monthly_trends.patients.map((val, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{val}</span>
                                <div style={{
                                    width: '100%', borderRadius: '6px 6px 0 0',
                                    height: `${(val / maxPatients) * 140}px`,
                                    background: `linear-gradient(180deg, #3b82f6, #1d4ed8)`,
                                    transition: 'height 0.5s ease'
                                }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{monthly_trends.months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card glass">
                    <h2 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Appointment <span style={{ color: '#10b981' }}>Trend</span></h2>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '180px' }}>
                        {monthly_trends.appointments.map((val, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{val}</span>
                                <div style={{
                                    width: '100%', borderRadius: '6px 6px 0 0',
                                    height: `${(val / maxAppts) * 140}px`,
                                    background: `linear-gradient(180deg, #10b981, #059669)`,
                                    transition: 'height 0.5s ease'
                                }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{monthly_trends.months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
