import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, ArrowLeft, X, Users, Mail, Phone } from 'lucide-react';
import api from '../services/api';

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [deptStaff, setDeptStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [formData, setFormData] = useState({ name: '', head_doctor: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error('Failed to fetch departments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeptClick = async (dept) => {
        setSelectedDept(dept);
        setLoadingStaff(true);
        try {
            const res = await api.get(`/staff?department=${encodeURIComponent(dept.name)}`);
            setDeptStaff(res.data);
        } catch (err) {
            console.error('Failed to fetch department staff:', err);
            setDeptStaff([]);
        } finally {
            setLoadingStaff(false);
        }
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/departments', formData);
            setDepartments([...departments, res.data.department]);
            setShowModal(false);
            setFormData({ name: '', head_doctor: '', description: '' });
        } catch (err) {
            console.error('Failed to add department:', err);
        }
    };

    const deptColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    const statusColor = (status) => {
        if (status === 'active') return '#10b981';
        if (status === 'on-leave') return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Hospital <span style={{ color: 'var(--primary)' }}>Departments</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Click on a department to view its staff</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Department
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading departments...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {departments.map((dept, i) => (
                        <div key={dept.id} className="card glass dept-card" 
                            style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', border: selectedDept?.id === dept.id ? `1px solid ${deptColors[i % deptColors.length]}` : undefined }}
                            onClick={() => handleDeptClick(dept)}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: deptColors[i % deptColors.length] }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.75rem', background: `${deptColors[i % deptColors.length]}15`, borderRadius: '10px' }}>
                                    <Building2 size={24} color={deptColors[i % deptColors.length]} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{dept.name}</h3>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>{dept.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <Users size={14} /> {dept.staff_count} Staff
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Head: {dept.head_doctor}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Department Staff Panel */}
            {selectedDept && (
                <div className="fade-in" style={{ marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '0.25rem', fontSize: '1.5rem' }}>
                                Staff in <span style={{ color: 'var(--primary)' }}>{selectedDept.name}</span>
                            </h2>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Head: {selectedDept.head_doctor}</p>
                        </div>
                        <button onClick={() => setSelectedDept(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            Close
                        </button>
                    </div>

                    {loadingStaff ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading staff...</p>
                    ) : deptStaff.length === 0 ? (
                        <div className="card glass" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <Users size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>No staff members found in {selectedDept.name}.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {deptStaff.map(s => (
                                <div key={s.id} className="card glass" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '50%',
                                            background: s.role === 'doctor' ? 'rgba(59,130,246,0.15)' : s.role === 'nurse' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: s.role === 'doctor' ? '#3b82f6' : s.role === 'nurse' ? '#10b981' : '#f59e0b',
                                            fontWeight: 700, fontSize: '1.1rem'
                                        }}>
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{s.name}</p>
                                            <span className="badge" style={{
                                                background: s.role === 'doctor' ? 'rgba(59,130,246,0.15)' : s.role === 'nurse' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                                color: s.role === 'doctor' ? '#3b82f6' : s.role === 'nurse' ? '#10b981' : '#f59e0b',
                                                fontSize: '0.7rem', padding: '0.15rem 0.5rem'
                                            }}>{s.role}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                            <Mail size={14} /> {s.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                            <Phone size={14} /> {s.phone}
                                        </div>
                                        <div style={{ marginTop: '0.25rem' }}>
                                            <span style={{ color: statusColor(s.status), fontWeight: 500, fontSize: '0.85rem' }}>● {s.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Department Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content card glass" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Add New Department</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddDepartment}>
                            <div className="form-group">
                                <label>Department Name</label>
                                <input className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Oncology" />
                            </div>
                            <div className="form-group">
                                <label>Head Doctor</label>
                                <input className="input-field" value={formData.head_doctor} onChange={e => setFormData({ ...formData, head_doctor: e.target.value })} placeholder="Dr. Jane Doe" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="input-field" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the department" rows={3} style={{ resize: 'vertical' }} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Create Department</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentsPage;
