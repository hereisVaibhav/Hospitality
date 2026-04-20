import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, UserPlus, Activity, BedDouble, Calendar, TrendingUp,
    ChevronRight, Clock, CheckCircle, AlertCircle, BarChart3
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const displayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, apptRes] = await Promise.all([
                    api.get('/reports/stats'),
                    api.get('/appointments'),
                ]);
                setStats(statsRes.data);
                setAppointments(apptRes.data);
            } catch {/* silent */}
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date === todayStr);
    const pendingAppts = appointments.filter(a => a.status === 'booked');
    const completedAppts = appointments.filter(a => a.status === 'completed');

    const statusColors = { completed: '#10b981', 'in-progress': '#3b82f6', booked: '#f59e0b', cancelled: '#ef4444' };

    const deptData = [
        { name: 'Cardiology', patients: 24, color: '#6366f1', percent: 80 },
        { name: 'Neurology', patients: 18, color: '#06b6d4', percent: 60 },
        { name: 'Pediatrics', patients: 12, color: '#10b981', percent: 40 },
        { name: 'Orthopedics', patients: 9, color: '#f59e0b', percent: 30 },
        { name: 'Dermatology', patients: 7, color: '#8b5cf6', percent: 23 },
    ];

    const quickActions = [
        { label: 'Manage Staff', path: '/dashboard/staff', icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
        { label: 'View Reports', path: '/dashboard/reports', icon: BarChart3, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
        { label: 'Departments', path: '/dashboard/departments', icon: BedDouble, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        { label: 'Settings', path: '/dashboard/settings', icon: Activity, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    ];

    if (loading) return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <BarChart3 size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Loading admin dashboard...</p>
        </div>
    );

    return (
        <div className="dashboard fade-in" style={{ padding: '2rem 0' }}>

            {/* ── Header ── */}
            <header style={{ marginBottom: '2.5rem' }}>
                <div className="section-eyebrow" style={{ marginBottom: '0.5rem' }}>Admin Portal</div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                    Hospital <span className="gradient-text">Overview</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{displayDate}</p>
            </header>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {stats ? [
                    { label: 'Total Patients', value: stats.total_patients?.toLocaleString() || '0', icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                    { label: 'Active Doctors', value: stats.active_doctors || '0', icon: UserPlus, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                    { label: 'Bed Occupancy', value: `${stats.bed_occupancy || 0}%`, icon: BedDouble, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                    { label: "Appts Today", value: todayAppts.length || stats.appointments_today || 0, icon: Calendar, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
                    { label: 'Pending', value: pendingAppts.length, icon: Clock, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                    { label: 'Completed', value: completedAppts.length, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                ].map((card, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ background: card.bg }}>
                            <card.icon size={22} color={card.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{card.label}</div>
                        </div>
                    </div>
                )) : <p style={{ color: 'var(--text-muted)' }}>Loading stats...</p>}
            </div>

            {/* ── Main Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Today's Appointments */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Calendar size={20} color="var(--primary-light)" />
                            <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Today's Appointments</h2>
                        </div>
                        <span className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary-light)' }}>
                            {todayAppts.length} total
                        </span>
                    </div>
                    {todayAppts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                            No appointments scheduled for today.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {todayAppts.slice(0, 5).map(appt => {
                                const color = statusColors[appt.status] || '#94a3b8';
                                return (
                                    <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0.9rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{appt.patient}</p>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.76rem' }}>{appt.doctor} · {appt.time}</p>
                                        </div>
                                        <span className="badge" style={{ background: `${color}15`, color, fontSize: '0.72rem' }}>
                                            {appt.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <Activity size={20} color="var(--primary-light)" />
                        <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Quick Actions</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {quickActions.map((a, i) => (
                            <button key={i} onClick={() => navigate(a.path)} className="quick-action-btn" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem', padding: '1rem' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '10px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <a.icon size={18} color={a.color} />
                                </div>
                                <span style={{ fontSize: '0.85rem' }}>{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Department Occupancy */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <BarChart3 size={20} color="var(--primary-light)" />
                        <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Department Load</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {deptData.map((dept, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{dept.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dept.patients} patients</span>
                                </div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${dept.percent}%`, background: dept.color, borderRadius: 3, opacity: 0.8 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <TrendingUp size={20} color="var(--primary-light)" />
                        <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Recent Activity</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {[
                            { text: 'Dr. Sarah Johnson completed Cardiology session', time: '2m ago', color: '#10b981' },
                            { text: 'New patient admitted — Room 204', time: '15m ago', color: '#3b82f6' },
                            { text: 'Bob Wilson appointment marked In Progress', time: '1h ago', color: '#f59e0b' },
                            { text: 'System backup completed successfully', time: '4h ago', color: '#8b5cf6' },
                            { text: 'Department schedules updated for next week', time: '5h ago', color: '#06b6d4' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, marginTop: '0.35rem', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.text}</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-faint)' }}>{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
