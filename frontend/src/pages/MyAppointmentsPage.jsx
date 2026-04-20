import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, X, CheckCircle, Clock, XCircle, PlayCircle } from 'lucide-react';
import api from '../services/api';

const MyAppointmentsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const doctorName = user?.name || 'Dr. Smith';

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get(`/appointments?doctor=${encodeURIComponent(doctorName)}`);
            setAppointments(res.data);
        } catch (err) {
            console.error('Failed to fetch appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAppointment = async (id, status, notes) => {
        try {
            const body = {};
            if (status) body.status = status;
            if (notes !== undefined) body.notes = notes;
            const res = await api.patch(`/appointments/${id}`, body);
            setAppointments(prev => prev.map(a => a.id === id ? res.data.appointment : a));
            setSelectedAppt(null);
            setNoteText('');
        } catch (err) {
            console.error('Failed to update appointment:', err);
        }
    };

    const statusColors = { completed: '#10b981', 'in-progress': '#3b82f6', booked: '#f59e0b', cancelled: '#ef4444' };
    const statusIcons = { completed: CheckCircle, 'in-progress': PlayCircle, booked: Clock, cancelled: XCircle };

    const filtered = filterStatus === 'all' ? appointments : appointments.filter(a => a.status === filterStatus);

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>My <span style={{ color: 'var(--primary)' }}>Appointments</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage your patient appointments and add diagnosis notes</p>
                </div>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['all', 'booked', 'in-progress', 'completed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className="btn" style={{
                            background: filterStatus === s ? (s === 'all' ? 'var(--primary)' : statusColors[s]) : 'rgba(255,255,255,0.05)',
                            color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem',
                            border: filterStatus === s ? 'none' : '1px solid var(--glass-border)',
                        }}>
                        {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading appointments...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filtered.map(appt => {
                        const StatusIcon = statusIcons[appt.status] || Clock;
                        return (
                            <div key={appt.id} className="card glass" style={{ padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s' }}
                                onClick={() => { setSelectedAppt(appt); setNoteText(appt.notes || ''); }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ padding: '0.75rem', background: `${statusColors[appt.status]}15`, borderRadius: '10px' }}>
                                            <StatusIcon size={24} color={statusColors[appt.status]} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{appt.patient}</h3>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{appt.department}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{appt.date}</p>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{appt.time}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                                    <span className="badge" style={{ background: `${statusColors[appt.status]}20`, color: statusColors[appt.status] }}>
                                        {appt.status}
                                    </span>
                                    {appt.notes && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '60%', textAlign: 'right' }}>{appt.notes}</p>}
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No appointments found.</p>}
                </div>
            )}

            {/* Appointment Detail Modal */}
            {selectedAppt && (
                <div className="modal-overlay" onClick={() => setSelectedAppt(null)}>
                    <div className="modal-content card glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Appointment Details</h2>
                            <button onClick={() => setSelectedAppt(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div><p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Patient</p><p style={{ margin: 0, fontWeight: 600 }}>{selectedAppt.patient}</p></div>
                            <div><p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department</p><p style={{ margin: 0, fontWeight: 600 }}>{selectedAppt.department}</p></div>
                            <div><p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Date</p><p style={{ margin: 0, fontWeight: 600 }}>{selectedAppt.date}</p></div>
                            <div><p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Time</p><p style={{ margin: 0, fontWeight: 600 }}>{selectedAppt.time}</p></div>
                        </div>

                        <div className="form-group">
                            <label>Update Status</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['booked', 'in-progress', 'completed', 'cancelled'].map(s => (
                                    <button key={s} onClick={() => handleUpdateAppointment(selectedAppt.id, s, noteText)}
                                        className="btn" style={{
                                            background: selectedAppt.status === s ? statusColors[s] : `${statusColors[s]}20`,
                                            color: selectedAppt.status === s ? 'white' : statusColors[s],
                                            padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: 'none'
                                        }}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>Diagnosis / Notes</label>
                            <textarea className="input-field" rows={4} value={noteText} onChange={e => setNoteText(e.target.value)}
                                placeholder="Add diagnosis notes, observations, or treatment plan..." />
                        </div>

                        <button onClick={() => handleUpdateAppointment(selectedAppt.id, null, noteText)}
                            className="btn btn-primary" style={{ width: '100%' }}>
                            Save Notes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsPage;
