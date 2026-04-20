import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft, Calendar, Plus, X, Clock, CheckCircle, XCircle,
    ChevronRight, ChevronLeft, User, Stethoscope, AlertCircle, Info
} from 'lucide-react';
import api from '../services/api';

const DOCTORS_BY_DEPT = {
    'Cardiology':   ['Dr. Sarah Johnson'],
    'Neurology':    ['Dr. Michael Chen'],
    'Orthopedics':  ['Dr. Robert Martinez'],
    'Pediatrics':   ['Dr. Emily Davis'],
    'Dermatology':  ['Dr. Priya Sharma'],
};

const PatientAppointmentsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    // Booking state — 2-step wizard
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ department: 'Cardiology', doctor: 'Dr. Sarah Johnson', date: '' });
    const [selectedSlot, setSelectedSlot] = useState('');
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState('');

    const patientName = user?.name || 'John Doe';

    // Compute today's min date for the date picker
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => { fetchAppointments(); }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/appointments?patient=${encodeURIComponent(patientName)}`);
            setAppointments(res.data);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    // When dept changes, auto-select first doctor
    const handleDeptChange = (dept) => {
        const firstDoc = DOCTORS_BY_DEPT[dept]?.[0] || '';
        setFormData({ ...formData, department: dept, doctor: firstDoc });
        setSelectedSlot('');
        setSlots([]);
    };

    // Step 1 → Step 2: fetch available slots
    const fetchSlots = async () => {
        if (!formData.doctor || !formData.date) return;
        setSlotsLoading(true);
        setSlotsError('');
        setSelectedSlot('');
        try {
            const res = await api.get(`/appointments/available-slots?doctor=${encodeURIComponent(formData.doctor)}&date=${formData.date}`);
            setSlots(res.data.slots || []);
        } catch {
            setSlotsError('Could not load slots. Please try again.');
        } finally {
            setSlotsLoading(false);
        }
        setStep(2);
    };

    const handleBookAppointment = async () => {
        if (!selectedSlot) return;
        setBookingError('');
        setBookingSuccess('');
        try {
            const res = await api.post('/appointments', {
                patient: patientName,
                department: formData.department,
                doctor: formData.doctor,
                date: formData.date,
                time: selectedSlot,
            });
            setAppointments(prev => [...prev, res.data.appointment]);
            setBookingSuccess(`Appointment confirmed! ${formData.doctor} on ${formData.date} at ${selectedSlot}`);
            setTimeout(() => {
                closeModal();
                setBookingSuccess('');
            }, 2500);
        } catch (err) {
            const msg = err.response?.data?.detail || 'Booking failed. Please try again.';
            setBookingError(msg);
        }
    };

    const closeModal = () => {
        setShowBookingModal(false);
        setStep(1);
        setFormData({ department: 'Cardiology', doctor: 'Dr. Sarah Johnson', date: '' });
        setSelectedSlot('');
        setSlots([]);
        setBookingError('');
        setBookingSuccess('');
        setSlotsError('');
    };

    const handleCancelAppointment = async (id) => {
        try {
            await api.delete(`/appointments/${id}`);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
        } catch { /* silent */ }
    };

    const statusColors = { completed: '#10b981', 'in-progress': '#3b82f6', booked: '#f59e0b', cancelled: '#ef4444' };
    const statusIcons = { completed: CheckCircle, 'in-progress': Clock, booked: Clock, cancelled: XCircle };

    const filtered = filterStatus === 'all' ? appointments : appointments.filter(a => a.status === filterStatus);
    const upcoming = appointments.filter(a => a.status === 'booked' || a.status === 'in-progress');

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-sm" style={{ marginTop: '0.4rem' }}>
                    <ArrowLeft size={16} />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
                        My <span className="gradient-text">Appointments</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                        {upcoming.length} upcoming · {appointments.length} total
                    </p>
                </div>
                <button
                    onClick={() => { setShowBookingModal(true); setStep(1); }}
                    className="btn btn-primary"
                >
                    <Plus size={16} /> Book Appointment
                </button>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['all', 'booked', 'in-progress', 'completed', 'cancelled'].map(s => {
                    const activeColor = s === 'all' ? 'var(--primary)' : statusColors[s];
                    return (
                        <button key={s} onClick={() => setFilterStatus(s)} className="btn btn-sm" style={{
                            background: filterStatus === s ? activeColor : 'rgba(255,255,255,0.04)',
                            color: filterStatus === s ? 'white' : 'var(--text-muted)',
                            border: filterStatus === s ? 'none' : '1px solid var(--glass-border)',
                        }}>
                            {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    );
                })}
            </div>

            {/* Appointments Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Clock size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Loading appointments...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <Calendar size={48} color="var(--text-faint)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>No appointments in this category.</p>
                    <button onClick={() => setShowBookingModal(true)} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                        <Plus size={16} /> Book Your First Appointment
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
                    {filtered.map(appt => {
                        const StatusIcon = statusIcons[appt.status] || Clock;
                        const color = statusColors[appt.status] || '#94a3b8';
                        return (
                            <div key={appt.id} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                                {/* Status bar */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color, borderRadius: '16px 0 0 16px' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Stethoscope size={18} color={color} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{appt.doctor}</h3>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{appt.department}</p>
                                        </div>
                                    </div>
                                    <span className="badge" style={{ background: `${color}18`, color }}>
                                        <StatusIcon size={11} /> {appt.status === 'in-progress' ? 'In Progress' : appt.status}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '0.75rem' }}>
                                    <div>
                                        <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date</p>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{appt.date}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Time</p>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{appt.time}</p>
                                    </div>
                                </div>

                                {appt.notes && (
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem', fontStyle: 'italic', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text)', fontStyle: 'normal' }}>Notes:</span> {appt.notes}
                                    </p>
                                )}

                                {appt.status === 'booked' && (
                                    <button
                                        onClick={() => handleCancelAppointment(appt.id)}
                                        className="btn btn-danger btn-sm"
                                        style={{ marginTop: '0.75rem', width: '100%' }}
                                    >
                                        Cancel Appointment
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Booking Modal ── */}
            {showBookingModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>

                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Book Appointment</h2>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                    Step {step} of 2 — {step === 1 ? 'Select Doctor & Date' : 'Choose Time Slot'}
                                </p>
                            </div>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={22} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: 4, background: 'var(--glass-border)', borderRadius: 2, marginBottom: '1.75rem', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: step === 1 ? '50%' : '100%', background: 'var(--gradient-primary)', transition: 'width 0.4s ease', borderRadius: 2 }} />
                        </div>

                        {/* Success State */}
                        {bookingSuccess && (
                            <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle size={20} color="#10b981" />
                                <p style={{ margin: 0, color: '#10b981', fontSize: '0.88rem' }}>{bookingSuccess}</p>
                            </div>
                        )}

                        {/* ── STEP 1: Select Doctor & Date ── */}
                        {step === 1 && (
                            <div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <select className="input-field" value={formData.department} onChange={e => handleDeptChange(e.target.value)}>
                                        {Object.keys(DOCTORS_BY_DEPT).map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Doctor</label>
                                    <select className="input-field" value={formData.doctor} onChange={e => setFormData({ ...formData, doctor: e.target.value })}>
                                        {(DOCTORS_BY_DEPT[formData.department] || []).map(doc => (
                                            <option key={doc}>{doc}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Preferred Date</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        min={today}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        style={{ colorScheme: 'dark' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                    <Info size={14} color="var(--primary-light)" />
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        On the next step you'll see real-time available slots for this doctor and date.
                                    </p>
                                </div>

                                <button
                                    onClick={fetchSlots}
                                    disabled={!formData.date}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    Check Available Slots <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* ── STEP 2: Slot Picker ── */}
                        {step === 2 && (
                            <div>
                                <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Stethoscope size={14} color="var(--primary-light)" /> {formData.doctor}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Calendar size={14} color="var(--primary-light)" /> {formData.date}
                                    </div>
                                </div>

                                {/* Slot Legend */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Available
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#475569', display: 'inline-block' }} /> Booked
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-light)' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} /> Selected
                                    </span>
                                </div>

                                {slotsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        <Clock size={28} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                                        <p style={{ fontSize: '0.88rem' }}>Loading available slots...</p>
                                    </div>
                                ) : slotsError ? (
                                    <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                                        <AlertCircle size={16} color="#ef4444" />
                                        <p style={{ margin: 0, color: '#ef4444', fontSize: '0.85rem' }}>{slotsError}</p>
                                    </div>
                                ) : (
                                    <div className="slot-grid">
                                        {slots.map(slot => (
                                            <button
                                                key={slot.time}
                                                className={`slot-btn ${selectedSlot === slot.time ? 'selected' : slot.available ? 'available' : 'booked'}`}
                                                disabled={!slot.available}
                                                onClick={() => slot.available && setSelectedSlot(slot.time)}
                                                title={slot.available ? `Select ${slot.time}` : `${slot.time} — Booked`}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Available slots count */}
                                {slots.length > 0 && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
                                        {slots.filter(s => s.available).length} of {slots.length} slots available
                                    </p>
                                )}

                                {/* Error */}
                                {bookingError && (
                                    <div style={{ padding: '0.85rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <p style={{ margin: 0, color: '#ef4444', fontSize: '0.84rem' }}>{bookingError}</p>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button onClick={() => { setStep(1); setSelectedSlot(''); setBookingError(''); }} className="btn btn-secondary" style={{ flex: 1 }}>
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                    <button
                                        onClick={handleBookAppointment}
                                        disabled={!selectedSlot || !!bookingSuccess}
                                        className="btn btn-primary"
                                        style={{ flex: 2 }}
                                    >
                                        <CheckCircle size={16} />
                                        {selectedSlot ? `Confirm ${selectedSlot}` : 'Select a Slot'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientAppointmentsPage;
