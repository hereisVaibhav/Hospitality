import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, FileText, Heart, Pill, ClipboardList } from 'lucide-react';
import api from '../services/api';

const MedicalRecordsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [patientDetails, setPatientDetails] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const patientName = user?.name || 'John Doe';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patRes, rxRes] = await Promise.all([
                    api.get(`/patients?name=${encodeURIComponent(patientName)}`),
                    api.get(`/prescriptions?patient=${encodeURIComponent(patientName)}`),
                ]);
                if (patRes.data && patRes.data.length > 0) {
                    setPatientDetails(patRes.data[0]);
                }
                setPrescriptions(rxRes.data);
            } catch (err) {
                console.error('Failed to fetch medical records:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [patientName]);

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Medical <span style={{ color: 'var(--primary)' }}>Records</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>View your medical history and prescriptions</p>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</p>
            ) : (
                <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'minmax(300px, 1fr) 2fr' }}>
                    
                    {/* Left Column: Medical History Profile */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card glass">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                <Heart size={22} color="#ef4444" />
                                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Health Profile</h2>
                            </div>
                            
                            {patientDetails ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Primary Physician</p>
                                        <p style={{ margin: 0, fontWeight: 500, fontSize: '1.05rem' }}>{patientDetails.assigned_doctor}</p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Blood Group</p>
                                            <p style={{ margin: 0, fontWeight: 500, color: '#ef4444' }}>{patientDetails.blood_group}</p>
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Age / Gender</p>
                                            <p style={{ margin: 0, fontWeight: 500 }}>{patientDetails.age}y, {patientDetails.gender}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Medical History</p>
                                        <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>{patientDetails.medical_history}</p>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No health profile data available.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Prescriptions */}
                    <div>
                        <div className="card glass" style={{ height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                <ClipboardList size={22} color="#8b5cf6" />
                                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Active Prescriptions</h2>
                            </div>

                            {prescriptions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                    <Pill size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: 'var(--text-muted)' }}>No active prescriptions found.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {prescriptions.map(rx => (
                                        <div key={rx.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ padding: '0.5rem', background: 'rgba(139,92,246,0.15)', borderRadius: '8px' }}>
                                                        <FileText size={18} color="#8b5cf6" />
                                                    </div>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Prescribed by {rx.doctor}</h3>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rx.date}</span>
                                            </div>

                                            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1rem' }}>
                                                <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Medicines</p>
                                                <p style={{ margin: '0 0 1rem 0', fontWeight: 500, fontSize: '1.05rem' }}>{rx.medicines}</p>
                                                
                                                <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Dosage Instructions</p>
                                                <p style={{ margin: 0, fontSize: '0.95rem' }}>{rx.dosage}</p>
                                            </div>

                                            {rx.notes && (
                                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                                    <span style={{ fontWeight: 600, color: 'white', fontStyle: 'normal' }}>Notes:</span> {rx.notes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordsPage;
