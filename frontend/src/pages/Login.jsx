import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Stethoscope, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react';

const ROLES = [
    { key: 'patient',  label: 'Patient',       icon: User,        color: '#10b981', hint: 'patient@hospital.com / patient123' },
    { key: 'doctor',   label: 'Doctor',         icon: Stethoscope, color: '#6366f1', hint: 'doctor@hospital.com / doctor123'  },
    { key: 'admin',    label: 'Administrator',  icon: Shield,      color: '#f59e0b', hint: 'admin@hospital.com / admin123'     },
];

const Login = () => {
    const [email,        setEmail]        = useState('');
    const [password,     setPassword]     = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeRole,   setActiveRole]   = useState('patient');
    const [error,        setError]        = useState('');
    const [loading,      setLoading]      = useState(false);
    const { login } = useAuth();
    const navigate  = useNavigate();

    const currentRole = ROLES.find(r => r.key === activeRole);

    const handleRoleSelect = (key) => {
        setActiveRole(key);
        setError('');
        const role = ROLES.find(r => r.key === key);
        const [hintEmail, hintPwd] = role.hint.split(' / ');
        setEmail(hintEmail);
        setPassword(hintPwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="login-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '2rem 1rem' }}>
            <div style={{ width: '100%', maxWidth: '460px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '20px', margin: '0 auto 1.25rem',
                        background: `linear-gradient(135deg, ${currentRole.color}25, ${currentRole.color}10)`,
                        border: `2px solid ${currentRole.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease',
                    }}>
                        <currentRole.icon size={32} color={currentRole.color} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.4rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your HospitHub account</p>
                </div>

                {/* Role Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '0.35rem', border: '1px solid var(--glass-border)' }}>
                    {ROLES.map(role => (
                        <button
                            key={role.key}
                            onClick={() => handleRoleSelect(role.key)}
                            style={{
                                flex: 1, padding: '0.6rem 0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: activeRole === role.key ? `${role.color}18` : 'transparent',
                                color: activeRole === role.key ? role.color : 'var(--text-muted)',
                                fontWeight: activeRole === role.key ? 700 : 500,
                                fontSize: '0.82rem', transition: 'all 0.2s ease',
                                outline: activeRole === role.key ? `1px solid ${role.color}40` : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                            }}
                        >
                            <role.icon size={13} />
                            {role.label}
                        </button>
                    ))}
                </div>

                {/* Form Card */}
                <div className="card glass" style={{ padding: '2rem' }}>
                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="glass"
                                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="glass"
                                    style={{ width: '100%', padding: '0.8rem 2.75rem 0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.875rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: `linear-gradient(135deg, ${currentRole.color}, ${currentRole.color}cc)` }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : (
                                <><LogIn size={17} /> Sign In as {currentRole.label}</>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>New patient? </span>
                        <Link to="/register" style={{ color: currentRole.color, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                            Create your account <ChevronRight size={13} style={{ verticalAlign: 'middle' }} />
                        </Link>
                    </div>
                </div>

                {/* Demo hint */}
                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-faint)' }}>
                    <span style={{ background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.85rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        Demo: <strong style={{ color: currentRole.color }}>{currentRole.hint}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
