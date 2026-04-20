import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    BedDouble, Activity, CheckCircle,
    Plus, X, RefreshCw, Send,
    Stethoscope, Syringe, ClipboardList
} from 'lucide-react';
import api from '../services/api';

const STATUS_CONFIG = {
    available: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', label: 'Available' },
    occupied:  { color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)', border: 'rgba(14,165,233,0.25)', label: 'Occupied'  },
    reserved:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', label: 'Reserved'  },
};

// ─── Ward Summary Card ────────────────────────────────────────────────────────
const WardCard = ({ ward, selected, onClick }) => {
    const pct = ward.occupancy_pct;
    const barColor = pct >= 85 ? '#f59e0b' : '#0ea5e9'; // changed strictly red to amber for treatment
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%', textAlign: 'left', background: selected
                    ? `linear-gradient(135deg, ${ward.color}15, ${ward.color}08)`
                    : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selected ? ward.color + '50' : 'var(--glass-border)'}`,
                borderRadius: '16px', padding: '1.25rem', cursor: 'pointer',
                transition: 'all 0.2s ease',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div>
                    <div style={{ fontSize: '0.7rem', color: ward.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{ward.short}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ward.name}</div>
                </div>
                <div style={{ background: `${ward.color}18`, border: `1px solid ${ward.color}30`, borderRadius: '8px', padding: '0.3rem 0.65rem', fontSize: '0.78rem', color: ward.color, fontWeight: 700 }}>
                    {ward.available_beds}/{ward.total_beds} free
                </div>
            </div>
            {/* Capacity bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                <span>{ward.occupied_beds} occupied</span>
                <span style={{ color: barColor }}>{pct}% full</span>
            </div>
        </button>
    );
};

// ─── Bed Cell (Doctor view) ───────────────────────────────────────────────────
const BedCell = ({ bed, onAdmit, onDischarge }) => {
    const cfg = STATUS_CONFIG[bed.status] || STATUS_CONFIG.available;
    return (
        <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '12px', padding: '1rem', position: 'relative', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', fontFamily: 'monospace', color: cfg.color }}>{bed.bed_no}</span>
                <span style={{ fontSize: '0.68rem', background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 700 }}>{cfg.label}</span>
            </div>
            {bed.patient ? (
                <>
                    <p style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '0.88rem' }}>{bed.patient}</p>
                    <p style={{ margin: '0 0 0.2rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{bed.condition}</p>
                    <p style={{ margin: '0 0 0.75rem', color: 'var(--text-faint)', fontSize: '0.7rem' }}>Admitted {bed.admitted_at}</p>
                    <button
                        onClick={() => onDischarge(bed)}
                        style={{ width: '100%', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.08)', color: '#0ea5e9', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(14,165,233,0.18)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(14,165,233,0.08)'; }}
                    >
                        Discharge
                    </button>
                </>
            ) : (
                <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                    <BedDouble size={22} color="rgba(16,185,129,0.4)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ color: 'var(--text-faint)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>Empty bed</p>
                    <button
                        onClick={() => onAdmit(bed)}
                        style={{ width: '100%', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', color: '#10b981', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.18)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.08)'; }}
                    >
                        + Admit Patient
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TreatmentWardsPage = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'doctor';

    const [wards,        setWards]        = useState([]);
    const [beds,         setBeds]         = useState([]);
    const [summary,      setSummary]      = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [activeWard,   setActiveWard]   = useState(null);
    const [showAdmit,    setShowAdmit]    = useState(false);
    const [showRequest,  setShowRequest]  = useState(false);
    const [showSuccess,  setShowSuccess]  = useState(null);
    const [selectedBed,  setSelectedBed]  = useState(null);
    const [admitForm,    setAdmitForm]    = useState({ patient_name: '', condition: '' });
    const [reqForm,      setReqForm]      = useState({ patient_name: user?.name || '', condition: '', referring_doctor: '', contact_number: '', ward_preference: '' });
    const [submitting,   setSubmitting]   = useState(false);
    const [error,        setError]        = useState('');

    const fetchAll = useCallback(async () => {
        try {
            const [wardsRes, bedsRes, sumRes] = await Promise.all([
                api.get('/treatment/wards'),
                api.get('/treatment/beds'),
                api.get('/treatment/summary'),
            ]);
            setWards(wardsRes.data);
            setBeds(bedsRes.data);
            setSummary(sumRes.data);
            if (!activeWard && wardsRes.data.length > 0) setActiveWard(wardsRes.data[0].id);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, [activeWard]);

    useEffect(() => { fetchAll(); }, []);

    const wardBeds = beds.filter(b => b.ward_id === activeWard);
    const activeWardInfo = wards.find(w => w.id === activeWard);

    const handleAdmit = async () => {
        if (!admitForm.patient_name || !admitForm.condition) { setError('All fields are required.'); return; }
        setSubmitting(true); setError('');
        try {
            await api.post(`/treatment/beds/${selectedBed.id}/admit`, {
                bed_id:      selectedBed.id,
                patient_name: admitForm.patient_name,
                condition:    admitForm.condition,
                admitted_by:  user?.name || 'Doctor',
            });
            setShowAdmit(false);
            setAdmitForm({ patient_name: '', condition: '' });
            await fetchAll();
        } catch (e) {
            setError(e.response?.data?.detail || 'Error admitting patient.');
        }
        setSubmitting(false);
    };

    const handleDischarge = async (bed) => {
        try {
            await api.post(`/treatment/beds/${bed.id}/discharge`);
            await fetchAll();
        } catch (e) { /* silent */ }
    };

    const handleRequest = async () => {
        if (!reqForm.condition || !reqForm.contact_number || !reqForm.referring_doctor) { setError('Please fill in all required fields.'); return; }
        setSubmitting(true); setError('');
        try {
            const res = await api.post('/treatment/request', reqForm);
            setShowRequest(false);
            setShowSuccess(res.data);
            setReqForm({ patient_name: user?.name || '', condition: '', referring_doctor: '', contact_number: '', ward_preference: '' });
        } catch (e) {
            setError(e.response?.data?.detail || 'Request failed. Please try again.');
        }
        setSubmitting(false);
    };

    if (loading) return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <Activity size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Loading treatment wards…</p>
        </div>
    );

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '14px', background: 'rgba(14,165,233,0.1)', border: '1.5px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Stethoscope size={26} color="#0ea5e9" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Medical Wards</span>
                        </div>
                        <h1 style={{ fontSize: '1.9rem', margin: 0 }}>
                            {isDoctor ? 'Treatment Ward Management' : 'Medical Treatment Wards'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
                            {isDoctor ? 'Manage bed assignments for specialized care units' : 'Apply for treatment bed assignment based on doctor recommendation'}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={fetchAll} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                    {!isDoctor && (
                        <button onClick={() => { setShowRequest(true); setError(''); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0ea5e9', borderColor: '#0ea5e9' }}>
                            <ClipboardList size={16} /> Apply for Bed
                        </button>
                    )}
                </div>
            </div>

            {/* ── Summary Bar ── */}
            {summary && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Total Beds',  value: summary.total_beds,  color: '#818cf8', bg: 'rgba(99,102,241,0.1)'  },
                        { label: 'Available',   value: summary.available,   color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
                        { label: 'Occupied',    value: summary.occupied,    color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)'   },
                        { label: 'Reserved',    value: summary.reserved,    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
                        { label: 'Occupancy',   value: `${summary.occupancy_pct}%`, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
                    ].map((s, i) => (
                        <div key={i} className="stat-card">
                            <div className="stat-icon" style={{ background: s.bg, padding: '0.6rem' }}>
                                <BedDouble size={18} color={s.color} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: s.color }}>{s.value}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginTop: '0.15rem' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Ward Selector Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {wards.map(ward => (
                    <WardCard key={ward.id} ward={ward} selected={activeWard === ward.id} onClick={() => setActiveWard(ward.id)} />
                ))}
            </div>

            {/* ── Beds Panel ── */}
            {activeWardInfo && (
                <div className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: activeWardInfo.color, boxShadow: `0 0 8px ${activeWardInfo.color}` }} />
                            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{activeWardInfo.name} — Bed Status</h2>
                            <span style={{ fontSize: '0.78rem', background: `${activeWardInfo.color}15`, color: activeWardInfo.color, padding: '0.15rem 0.65rem', borderRadius: '20px', fontWeight: 700 }}>
                                {activeWardInfo.available_beds} available
                            </span>
                        </div>
                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: cfg.color }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />{cfg.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Patient view — summary cards only */}
                    {!isDoctor && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            {wardBeds.map(bed => {
                                const cfg = STATUS_CONFIG[bed.status] || STATUS_CONFIG.available;
                                return (
                                    <div key={bed.id} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.82rem', fontFamily: 'monospace', color: cfg.color, marginBottom: '0.4rem' }}>{bed.bed_no}</div>
                                        <Syringe size={20} color={cfg.color} style={{ marginBottom: '0.4rem', margin: '0 auto' }} />
                                        <div style={{ fontSize: '0.72rem', color: cfg.color, fontWeight: 700 }}>{cfg.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Doctor view — full bed management grid */}
                    {isDoctor && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {wardBeds.map(bed => (
                                <BedCell
                                    key={bed.id}
                                    bed={bed}
                                    onAdmit={b => { setSelectedBed(b); setShowAdmit(true); setError(''); }}
                                    onDischarge={handleDischarge}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Patient Request Modal ── */}
            {showRequest && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowRequest(false)}>
                    <div className="modal-content" style={{ padding: '2rem', maxWidth: '480px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ClipboardList size={22} color="#0ea5e9" />
                                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Apply for Treatment Bed</h2>
                            </div>
                            <button onClick={() => setShowRequest(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                        </div>
                        <div style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#0ea5e9' }}>
                            This form is for requesting scheduled admission based on a doctor's recommendation. For immediate life-saving care, use the Emergency Ward.
                        </div>
                        {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.83rem' }}>{error}</div>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Your Name *</label>
                                <input value={reqForm.patient_name} onChange={e => setReqForm(f => ({ ...f, patient_name: e.target.value }))} placeholder={user?.name || 'Full name'} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.88rem', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Referring Doctor *</label>
                                <input value={reqForm.referring_doctor} onChange={e => setReqForm(f => ({ ...f, referring_doctor: e.target.value }))} placeholder="e.g. Dr. Smith" style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.88rem', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Condition / Diagnosis *</label>
                                <textarea value={reqForm.condition} onChange={e => setReqForm(f => ({ ...f, condition: e.target.value }))} rows={2} placeholder="Reason for admission..." style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.88rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Contact Number *</label>
                                <input type="tel" value={reqForm.contact_number} onChange={e => setReqForm(f => ({ ...f, contact_number: e.target.value }))} placeholder="+1-555-0100" style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.88rem', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Preferred Ward (optional)</label>
                                <select value={reqForm.ward_preference} onChange={e => setReqForm(f => ({ ...f, ward_preference: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(20,20,40,0.95)', color: 'white', fontSize: '0.88rem', boxSizing: 'border-box' }}>
                                    <option value="">No preference (auto-assign)</option>
                                    {wards.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowRequest(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={handleRequest} disabled={submitting} className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#0ea5e9', borderColor: '#0ea5e9' }}>
                                {submitting ? 'Submitting…' : <><Send size={15} /> Submit Application</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Doctor Admit Modal ── */}
            {showAdmit && selectedBed && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdmit(false)}>
                    <div className="modal-content" style={{ padding: '2rem', maxWidth: '440px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Plus size={20} color="#10b981" />
                                <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Admit Patient — {selectedBed.bed_no}</h2>
                            </div>
                            <button onClick={() => setShowAdmit(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                        </div>
                        {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.83rem' }}>{error}</div>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Patient Name *</label>
                                <input value={admitForm.patient_name} onChange={e => setAdmitForm(f => ({ ...f, patient_name: e.target.value }))} placeholder="Full patient name" style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.88rem', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 500 }}>Condition / Diagnosis *</label>
                                <input value={admitForm.condition} onChange={e => setAdmitForm(f => ({ ...f, condition: e.target.value }))} placeholder="e.g. Post-Surgery Recovery" style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '0.88rem', boxSizing: 'border-box' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowAdmit(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={handleAdmit} disabled={submitting} className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                                {submitting ? 'Admitting…' : <><CheckCircle size={15} /> Confirm Admit</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Success Modal ── */}
            {showSuccess && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowSuccess(null)}>
                    <div className="modal-content" style={{ padding: '2.5rem', maxWidth: '420px', textAlign: 'center' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <CheckCircle size={34} color="#10b981" />
                        </div>
                        <h2 style={{ marginBottom: '0.75rem' }}>Application Submitted!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                            Your treatment bed application has been received. You will be notified once a bed is assigned.
                        </p>
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Request ID</span>
                                <span style={{ fontWeight: 700, color: '#10b981' }}>#{showSuccess.request_id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Estimated Wait</span>
                                <span style={{ fontWeight: 700 }}>{showSuccess.estimated_wait}</span>
                            </div>
                        </div>
                        <button onClick={() => setShowSuccess(null)} className="btn btn-primary" style={{ width: '100%' }}>Done</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreatmentWardsPage;
