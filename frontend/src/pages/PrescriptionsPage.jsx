import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, FileText, Plus, X, Pill } from 'lucide-react';
import api from '../services/api';

const PrescriptionsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({ patient: '', medicines: '', dosage: '', notes: '' });

    const doctorName = user?.name || 'Dr. Smith';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rxRes, patRes] = await Promise.all([
                    api.get(`/prescriptions?doctor=${encodeURIComponent(doctorName)}`),
                    api.get(`/patients?doctor=${encodeURIComponent(doctorName)}`),
                ]);
                setPrescriptions(rxRes.data);
                setPatients(patRes.data);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [doctorName]);

    const handleWriteRx = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/prescriptions?doctor=${encodeURIComponent(doctorName)}`, formData);
            setPrescriptions([...prescriptions, res.data.prescription]);
            setShowModal(false);
            setFormData({ patient: '', medicines: '', dosage: '', notes: '' });
        } catch (err) {
            console.error('Failed to create prescription:', err);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>My <span style={{ color: 'var(--primary)' }}>Prescriptions</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Write and manage patient prescriptions</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Write Prescription
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading prescriptions...</p>
            ) : prescriptions.length === 0 ? (
                <div className="card glass" style={{ textAlign: 'center', padding: '3rem' }}>
                    <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No prescriptions written yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {prescriptions.map(rx => (
                        <div key={rx.id} className="card glass" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ padding: '0.6rem', background: 'rgba(139,92,246,0.1)', borderRadius: '10px' }}>
                                        <Pill size={22} color="#8b5cf6" />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{rx.patient}</h3>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{rx.date}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Medicines</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{rx.medicines}</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Dosage</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{rx.dosage}</p>
                                </div>
                            </div>

                            {rx.notes && (
                                <div style={{ marginTop: '0.75rem' }}>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 600, color: 'white' }}>Notes:</span> {rx.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Write Prescription Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content card glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Write Prescription</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleWriteRx}>
                            <div className="form-group">
                                <label>Patient</label>
                                <select className="input-field" required value={formData.patient} onChange={e => setFormData({ ...formData, patient: e.target.value })}>
                                    <option value="">Select a patient</option>
                                    {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Medicines</label>
                                <input className="input-field" required value={formData.medicines} onChange={e => setFormData({ ...formData, medicines: e.target.value })} placeholder="e.g. Amlodipine 5mg, Metformin 500mg" />
                            </div>
                            <div className="form-group">
                                <label>Dosage Instructions</label>
                                <input className="input-field" required value={formData.dosage} onChange={e => setFormData({ ...formData, dosage: e.target.value })} placeholder="e.g. Once daily after meals" />
                            </div>
                            <div className="form-group">
                                <label>Doctor's Notes</label>
                                <textarea className="input-field" rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes, follow-up instructions..." />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Create Prescription</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionsPage;
