import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, FileText, Activity, Clock, User, Droplets,
    Heart, Plus, ChevronRight, AlertCircle, Pill, TrendingUp
} from 'lucide-react';
import api from '../services/api';

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [patientDetails, setPatientDetails] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const patientName = user?.name || 'John Doe';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patRes, apptRes, rxRes] = await Promise.all([
                    api.get(`/patients?name=${encodeURIComponent(patientName)}`),
                    api.get(`/appointments?patient=${encodeURIComponent(patientName)}`),
                    api.get(`/prescriptions?patient=${encodeURIComponent(patientName)}`),
                ]);
                if (patRes.data?.length > 0) setPatientDetails(patRes.data[0]);
                setAppointments(apptRes.data);
                setPrescriptions(rxRes.data);
            } catch {/* silent */}
            finally { setLoading(false); }
        };
        fetchData();
    }, [patientName]);

    const upcomingAppts = appointments.filter(a => a.status === 'booked' || a.status === 'in-progress');
    const pastAppts = appointments.filter(a => a.status === 'completed');
    const nextAppt = upcomingAppts[0];

    const statusColors = { completed: '#10b981', 'in-progress': '#3b82f6', booked: '#f59e0b', cancelled: '#ef4444' };

    if (loading) return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <Clock size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Loading your dashboard...</p>
        </div>
    );

    return (
        <div className="dashboard fade-in" style={{ padding: '2rem 0' }}>

            {/* ── Header ── */}
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
                        border: '2px solid rgba(99,102,241,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <User size={30} color="#818cf8" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                            Patient Portal
                        </div>
                        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
                            Welcome back, <span className="gradient-text">{patientName.split(' ')[0]}</span>
                        </h1>
                        {patientDetails && (
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                    <Droplets size={11} /> Blood: {patientDetails.blood_group}
                                </span>
                                <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                    <Heart size={11} /> Age: {patientDetails.age}
                                </span>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                    ID: #{patientDetails.id.toString().padStart(4, '0')}
                                </span>
                                <span className="badge" style={{ background: patientDetails.admission_status === 'admitted' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: patientDetails.admission_status === 'admitted' ? '#ef4444' : '#10b981' }}>
                                    {patientDetails.admission_status}
                                </span>
                            </div>
                        )}
                    </div>
                    <button onClick={() => navigate('/dashboard/my-appointments')} className="btn btn-primary">
                        <Plus size={15} /> Book Appointment
                    </button>
                </div>
            </header>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Upcoming', value: upcomingAppts.length, icon: Calendar, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                    { label: 'Total Visits', value: pastAppts.length, icon: Activity, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                    { label: 'Prescriptions', value: prescriptions.length, icon: Pill, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                    { label: 'All Appointments', value: appointments.length, icon: TrendingUp, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
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

                {/* Next Appointment */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <Clock size={20} color="#f59e0b" />
                        <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Next Appointment</h2>
                    </div>
                    {!nextAppt ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                            <Calendar size={40} color="var(--text-faint)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>No upcoming appointments</p>
                            <button onClick={() => navigate('/dashboard/my-appointments')} className="btn btn-primary btn-sm">
                                Book Now
                            </button>
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '12px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: statusColors[nextAppt.status], borderRadius: '12px 0 0 12px' }} />
                            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{nextAppt.doctor}</h3>
                            <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{nextAppt.department}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</p>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{nextAppt.date}</p>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time</p>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{nextAppt.time}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <Activity size={20} color="var(--primary-light)" />
                        <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Quick Access</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Book New Appointment', path: '/dashboard/my-appointments', icon: Calendar, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                            { label: 'My Appointments', path: '/dashboard/my-appointments', icon: Clock, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
                            { label: 'Medical Records', path: '/dashboard/records', icon: FileText, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                            { label: 'Emergency Wards', path: '/dashboard/emergency', icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
                            { label: 'Treatment Wards', path: '/dashboard/treatment', icon: Plus, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
                        ].map((a, i) => (
                            <button key={i} onClick={() => navigate(a.path)} className="quick-action-btn">
                                <div style={{ width: 32, height: 32, borderRadius: '8px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <a.icon size={16} color={a.color} />
                                </div>
                                {a.label}
                                <ChevronRight size={16} color="var(--text-faint)" style={{ marginLeft: 'auto' }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Health Info Card */}
                {patientDetails && (
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <Heart size={20} color="#ef4444" />
                            <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Health Overview</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                { label: 'Primary Doctor', value: patientDetails.assigned_doctor },
                                { label: 'Blood Group', value: patientDetails.blood_group },
                                { label: 'Gender', value: patientDetails.gender },
                                { label: 'Status', value: patientDetails.admission_status },
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{row.label}</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                        {patientDetails.medical_history && (
                            <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '8px' }}>
                                <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Medical History</p>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{patientDetails.medical_history}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Appointments */}
                {appointments.length > 0 && (
                    <div className="card" style={{ gridColumn: patientDetails ? 'auto' : 'span 2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Calendar size={20} color="var(--primary-light)" />
                                <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Recent History</h2>
                            </div>
                            <button onClick={() => navigate('/dashboard/my-appointments')} className="btn btn-secondary btn-sm">
                                View All <ChevronRight size={13} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {appointments.slice(0, 4).map(appt => {
                                const color = statusColors[appt.status] || '#94a3b8';
                                return (
                                    <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{appt.doctor}</p>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.78rem' }}>{appt.date} · {appt.time}</p>
                                        </div>
                                        <span className="badge" style={{ background: `${color}15`, color }}>
                                            {appt.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
