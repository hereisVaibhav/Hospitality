import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, ArrowLeft, X, Trash2 } from 'lucide-react';
import api from '../services/api';

const ManageStaffPage = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: 'doctor', department: '', email: '', phone: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/staff');
            setStaff(res.data);
        } catch (err) {
            console.error('Failed to fetch staff:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/staff', formData);
            setStaff([...staff, res.data.staff]);
            setShowModal(false);
            setFormData({ name: '', role: 'doctor', department: '', email: '', phone: '' });
        } catch (err) {
            console.error('Failed to add staff:', err);
        }
    };

    const handleDeleteStaff = async (staffId) => {
        try {
            await api.delete(`/staff/${staffId}`);
            setStaff(staff.filter(s => s.id !== staffId));
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error('Failed to delete staff:', err);
        }
    };

    const filtered = staff.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'all' || s.role === filterRole;
        return matchesSearch && matchesRole;
    });

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
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Manage <span style={{ color: 'var(--primary)' }}>Staff</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>View, search, add, and remove staff members</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text" placeholder="Search staff by name or email..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="input-field"
                        style={{ width: '100%', paddingLeft: '40px' }}
                    />
                </div>
                <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="input-field" style={{ minWidth: '150px' }}>
                    <option value="all">All Roles</option>
                    <option value="doctor">Doctors</option>
                    <option value="nurse">Nurses</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Staff
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading staff...</p>
            ) : (
                <div className="card glass" style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id}>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    <td><span className="badge" style={{ background: s.role === 'doctor' ? 'rgba(59,130,246,0.15)' : s.role === 'nurse' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: s.role === 'doctor' ? '#3b82f6' : s.role === 'nurse' ? '#10b981' : '#f59e0b' }}>{s.role}</span></td>
                                    <td>{s.department}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{s.phone}</td>
                                    <td><span style={{ color: statusColor(s.status), fontWeight: 500 }}>● {s.status}</span></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => setShowDeleteConfirm(s)}
                                            className="delete-btn"
                                            title="Delete staff member"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No staff members found.</p>}
                </div>
            )}

            {/* Add Staff Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content card glass" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Add New Staff</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddStaff}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input className="input-field" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Dr. John Smith" />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="doctor">Doctor</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input className="input-field" required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="Cardiology" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input className="input-field" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@hospital.com" />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1-555-0100" />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Add Staff Member</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="modal-content card glass" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
                        <div style={{ padding: '1rem 0' }}>
                            <div style={{ width: '56px', height: '56px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <Trash2 size={28} color="#ef4444" />
                            </div>
                            <h2 style={{ marginBottom: '0.5rem' }}>Delete Staff Member</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                Are you sure you want to delete <strong style={{ color: 'white' }}>{showDeleteConfirm.name}</strong>? This action cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button onClick={() => setShowDeleteConfirm(null)} className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.65rem 1.5rem' }}>
                                    Cancel
                                </button>
                                <button onClick={() => handleDeleteStaff(showDeleteConfirm.id)} className="btn" style={{ background: '#ef4444', color: 'white', padding: '0.65rem 1.5rem' }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStaffPage;
