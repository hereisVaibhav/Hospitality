import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, Users, FileText, Activity, Clock, Stethoscope,
    ChevronRight, CheckCircle, AlertCircle, User, Siren, BedDouble
} from 'lucide-react';
import api from '../services/api';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const doctorName = user?.name || 'Dr. Smith';
    // Use today's real date
    const todayStr = new Date().toISOString().split('T')[0];
    const displayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptRes, patRes, rxRes] = await Promise.all([
                    api.get(`/appointments?doctor=${encodeURIComponent(doctorName)}`),
                    api.get(`/patients?doctor=${encodeURIComponent(doctorName)}`),
                    api.get(`/prescriptions?doctor=${encodeURIComponent(doctorName)}`),
                ]);
                setAppointments(apptRes.data);
                setPatients(patRes.data);
                setPrescriptions(rxRes.data);
            } catch {/* silent */}
            finally { setLoading(false); }
        };
        fetchData();
    }, [doctorName]);

    const todayAppts = appointments.filter(a => a.date === todayStr);
    const pendingAppts = appointments.filter(a => a.status === 'booked');
    const inProgressAppts = appointments.filter(a => a.status === 'in-progress');

    const statusColors = { completed: '#10b981', 'in-progress': '#3b82f6', booked: '#f59e0b', cancelled: '#ef4444' };

    if (loading) return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <Stethoscope size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Loading your dashboard...</p>
        </div>
    );

    return (
        <div className="dashboard fade-in" style={{ padding: '2rem 0' }}>

            {/* ── Header ── */}
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.15))',
                        border: '1px solid rgba(99,102,241,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Stethoscope size={28} color="#818cf8" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                            Doctor Portal
                        </div>
                        <h1 style={{ fontSize: '2rem', margin: 0 }}>
                            Welcome, <span className="gradient-text">{doctorName}</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.88rem' }}>
                            {displayDate}
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                    { label: "Today's Patients", value: todayAppts.length, icon: Calendar, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                    { label: 'Pending', value: pendingAppts.length, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                    { label: 'In Progress', value: inProgressAppts.length, icon: Activity, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                    { label: 'My Patients', value: patients.length, icon: Users, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                    { label: 'Prescriptions', value: prescriptions.length, icon: FileText, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                ].map((card, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ background: card.bg }}>
                            <card.icon size={24} color={card.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                {/* Today's Schedule */}
                <div className="card" style={{ gridColumn: 'span 1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Calendar size={20} color="var(--primary-light)" />
                            <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Today's Schedule</h2>
                        </div>
                        {todayAppts.length > 0 && (
                            <span className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary-light)' }}>
                                {todayAppts.length} patients
                            </span>
                        )}
                    </div>
                    {todayAppts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            <Calendar size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                            <p style={{ fontSize: '0.88rem' }}>No appointments scheduled for today</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {todayAppts.map((appt, i) => {
                                const color = statusColors[appt.status] || '#94a3b8';
                                return (
                                    <div key={appt.id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '10px', border: `1px solid rgba(255,255,255,0.04)`,
                                        position: 'relative', overflow: 'hidden'
                                    }}>
                                        {appt.status === 'in-progress' && (
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#3b82f6', borderRadius: '10px 0 0 10px' }} />
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} color={color} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{appt.patient}</p>
                                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{appt.time}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            {appt.status === 'in-progress' && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#3b82f6' }}>
                                                    <span className="pulse-dot" style={{ '--success': '#3b82f6' }} />
                                                </span>
                                            )}
                                            <span className="badge" style={{ background: `${color}15`, color, fontSize: '0.72rem' }}>
                                                {appt.status === 'in-progress' ? 'In Progress' : appt.status}
                                            </span>
                                        </div>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'My Appointments', path: '/dashboard/appointments', icon: Calendar, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', badge: pendingAppts.length },
                            { label: 'My Patients', path: '/dashboard/patients', icon: Users, color: '#10b981', bg: 'rgba(16,185,129,0.1)', badge: patients.length },
                            { label: 'Prescriptions', path: '/dashboard/prescriptions', icon: FileText, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', badge: prescriptions.length },
                            { label: 'Emergency Wards', path: '/dashboard/emergency', icon: Siren, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', badge: null },
                            { label: 'Treatment Wards', path: '/dashboard/treatment', icon: BedDouble, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', badge: null },
                        ].map((a, i) => (
                            <button key={i} onClick={() => navigate(a.path)} className="quick-action-btn">
                                <div style={{ width: 34, height: 34, borderRadius: '8px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <a.icon size={16} color={a.color} />
                                </div>
                                <span style={{ flex: 1 }}>{a.label}</span>
                                {a.badge > 0 && (
                                    <span style={{ background: a.bg, color: a.color, padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {a.badge}
                                    </span>
                                )}
                                <ChevronRight size={15} color="var(--text-faint)" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pending Queue */}
                {pendingAppts.length > 0 && (
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <Clock size={20} color="#f59e0b" />
                            <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Upcoming Queue</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {pendingAppts.slice(0, 5).map((appt) => (
                                <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'rgba(245,158,11,0.04)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.1)' }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{appt.patient}</p>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.76rem' }}>{appt.date} · {appt.time}</p>
                                    </div>
                                    <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '0.72rem' }}>
                                        Pending
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
