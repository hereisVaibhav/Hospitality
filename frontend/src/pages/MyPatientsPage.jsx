import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, Phone, Mail, Droplets, Heart } from 'lucide-react';
import api from '../services/api';

const MyPatientsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const doctorName = user?.name || 'Dr. Smith';

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await api.get(`/patients?doctor=${encodeURIComponent(doctorName)}`);
                setPatients(res.data);
            } catch (err) {
                console.error('Failed to fetch patients:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [doctorName]);

    const admissionColor = (status) => status === 'admitted' ? '#ef4444' : '#10b981';

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>My <span style={{ color: 'var(--primary)' }}>Patients</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>View and manage your assigned patients</p>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading patients...</p>
            ) : patients.length === 0 ? (
                <div className="card glass" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Users size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No patients assigned yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {patients.map(patient => (
                        <div key={patient.id} className="card glass" style={{ cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
                            onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            
                            {/* Top color bar based on admission status */}
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: admissionColor(patient.admission_status) }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    background: 'rgba(59,130,246,0.15)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: '#3b82f6', fontWeight: 700, fontSize: '1.2rem'
                                }}>
                                    {patient.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{patient.name}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{patient.age}y, {patient.gender}</span>
                                        <span className="badge" style={{
                                            background: `${admissionColor(patient.admission_status)}20`,
                                            color: admissionColor(patient.admission_status),
                                            fontSize: '0.7rem', padding: '0.1rem 0.5rem'
                                        }}>
                                            {patient.admission_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Droplets size={14} color="#ef4444" /> Blood: <span style={{ color: 'white', fontWeight: 500 }}>{patient.blood_group}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={14} /> {patient.phone}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={14} /> {patient.email}
                                </div>
                            </div>

                            {/* Expanded Medical History */}
                            {selectedPatient?.id === patient.id && (
                                <div className="fade-in" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Heart size={14} color="#ef4444" />
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Medical History</span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                                        {patient.medical_history}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPatientsPage;
