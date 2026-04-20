import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Lock, Phone, MapPin, Heart, Activity,
    ChevronRight, ChevronLeft, CheckCircle, Eye, EyeOff,
    Ruler, Weight, Calendar, AlertCircle, Pill, Stethoscope
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DOCTORS = [
    'Dr. Sarah Johnson (Cardiology)',
    'Dr. Michael Chen (Neurology)',
    'Dr. Robert Martinez (Orthopedics)',
    'Dr. Priya Sharma (Dermatology)',
    'Dr. Emily Davis (Pediatrics)',
    'No Preference',
];

const STEPS = [
    { id: 1, title: 'Account',  subtitle: 'Login credentials',        icon: Lock   },
    { id: 2, title: 'Profile',  subtitle: 'Personal & health details', icon: User   },
    { id: 3, title: 'Medical',  subtitle: 'Medical background',        icon: Heart  },
    { id: 4, title: 'Review',   subtitle: 'Confirm & register',        icon: CheckCircle },
];

const InputField = ({ label, icon: Icon, required, ...props }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
        <div style={{ position: 'relative' }}>
            {Icon && <Icon size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none' }} />}
            <input
                {...props}
                required={required}
                style={{ width: '100%', padding: Icon ? '0.75rem 1rem 0.75rem 2.5rem' : '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', outline: 'none', fontSize: '0.88rem', boxSizing: 'border-box', transition: 'border-color 0.2s', ...props.style }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon: Icon, options, required, ...props }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
        <div style={{ position: 'relative' }}>
            {Icon && <Icon size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', pointerEvents: 'none', zIndex: 1 }} />}
            <select
                {...props}
                required={required}
                style={{ width: '100%', padding: Icon ? '0.75rem 1rem 0.75rem 2.5rem' : '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(20,20,40,0.95)', color: 'white', outline: 'none', fontSize: '0.88rem', boxSizing: 'border-box', cursor: 'pointer', appearance: 'none' }}
            >
                <option value="">Select…</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    </div>
);

const TextAreaField = ({ label, icon: Icon, ...props }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
        <textarea
            {...props}
            rows={3}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', outline: 'none', fontSize: '0.88rem', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
    </div>
);

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        // Step 1
        name: '', email: '', password: '', confirmPassword: '',
        // Step 2
        date_of_birth: '', age: '', sex: '', height_cm: '', weight_kg: '',
        blood_group: '', mobile: '', address: '',
        emergency_contact_name: '', emergency_contact_phone: '',
        // Step 3
        known_allergies: '', current_medications: '', medical_history: '', preferred_doctor: '',
    });

    const set = (field, value) => setForm(f => ({ ...f, [field]: value }));
    const get = (field) => form[field];

    const validateStep = (s) => {
        if (s === 1) {
            if (!form.name.trim()) return 'Full name is required.';
            if (!form.email.trim()) return 'Email is required.';
            if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters.';
            if (form.password !== form.confirmPassword) return 'Passwords do not match.';
        }
        if (s === 2) {
            if (!form.sex) return 'Please select your sex.';
            if (!form.blood_group) return 'Please select your blood group.';
            if (!form.mobile.trim()) return 'Mobile number is required.';
        }
        return null;
    };

    const next = () => {
        const err = validateStep(step);
        if (err) { setError(err); return; }
        setError('');
        setStep(s => s + 1);
    };

    const back = () => { setError(''); setStep(s => s - 1); };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        const payload = {
            name: form.name, email: form.email, password: form.password,
            role: 'patient',
            age: form.age ? parseInt(form.age) : null,
            date_of_birth: form.date_of_birth || null,
            sex: form.sex || null,
            height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
            weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
            blood_group: form.blood_group || null,
            mobile: form.mobile || null,
            address: form.address || null,
            emergency_contact_name: form.emergency_contact_name || null,
            emergency_contact_phone: form.emergency_contact_phone || null,
            known_allergies: form.known_allergies || null,
            current_medications: form.current_medications || null,
            medical_history: form.medical_history || null,
            preferred_doctor: form.preferred_doctor || null,
        };
        const result = await register(payload);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const ReviewRow = ({ label, value }) => value ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem', flexShrink: 0 }}>{label}</span>
            <span style={{ fontWeight: 600, fontSize: '0.83rem', textAlign: 'right' }}>{value}</span>
        </div>
    ) : null;

    return (
        <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 70px)', padding: '2rem 1rem' }}>
            <div style={{ width: '100%', maxWidth: '580px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '18px', margin: '0 auto 1rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.15))', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stethoscope size={28} color="#10b981" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.35rem' }}>Create Patient Account</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Fill in your details to get started with HospitHub</p>
                </div>

                {/* Step Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
                    {STEPS.map((s, i) => {
                        const done    = step > s.id;
                        const current = step === s.id;
                        return (
                            <React.Fragment key={s.id}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: done ? '#10b981' : current ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                                        border: `2px solid ${done ? '#10b981' : current ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                                        transition: 'all 0.3s ease',
                                    }}>
                                        {done
                                            ? <CheckCircle size={18} color="white" />
                                            : <s.icon size={16} color={current ? '#818cf8' : 'var(--text-faint)'} />
                                        }
                                    </div>
                                    <span style={{ fontSize: '0.7rem', marginTop: '0.3rem', color: current ? '#818cf8' : done ? '#10b981' : 'var(--text-faint)', fontWeight: current ? 700 : 500, whiteSpace: 'nowrap' }}>{s.title}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ flex: 1, height: 2, margin: '0 0.4rem', marginBottom: '1.2rem', background: step > s.id ? '#10b981' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s ease' }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Card */}
                <div className="card" style={{ padding: '2rem' }}>
                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.7rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    {/* ── STEP 1 ── Account */}
                    {step === 1 && (
                        <>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Account Details</h2>
                            <InputField label="Full Name" icon={User} placeholder="Jane Doe" value={get('name')} onChange={e => set('name', e.target.value)} required />
                            <InputField label="Email Address" icon={Mail} type="email" placeholder="jane@example.com" value={get('email')} onChange={e => set('email', e.target.value)} required />
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Password <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Minimum 6 characters"
                                        value={get('password')}
                                        onChange={e => set('password', e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: 'white', outline: 'none', fontSize: '0.88rem', boxSizing: 'border-box' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <InputField label="Confirm Password" icon={Lock} type="password" placeholder="Re-enter password" value={get('confirmPassword')} onChange={e => set('confirmPassword', e.target.value)} required />
                        </>
                    )}

                    {/* ── STEP 2 ── Profile */}
                    {step === 2 && (
                        <>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Personal Details</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <InputField label="Date of Birth" icon={Calendar} type="date" value={get('date_of_birth')} onChange={e => { set('date_of_birth', e.target.value); const a = new Date().getFullYear() - new Date(e.target.value).getFullYear(); set('age', a); }} />
                                <InputField label="Age (years)" icon={User} type="number" min="0" max="120" placeholder="e.g. 30" value={get('age')} onChange={e => set('age', e.target.value)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <SelectField label="Sex" icon={User} options={['Male', 'Female', 'Other', 'Prefer not to say']} value={get('sex')} onChange={e => set('sex', e.target.value)} required />
                                <SelectField label="Blood Group" icon={Activity} options={BLOOD_GROUPS} value={get('blood_group')} onChange={e => set('blood_group', e.target.value)} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                <InputField label="Height (cm)" icon={Ruler} type="number" min="50" max="250" placeholder="e.g. 175" value={get('height_cm')} onChange={e => set('height_cm', e.target.value)} />
                                <InputField label="Weight (kg)" icon={Weight} type="number" min="1" max="400" placeholder="e.g. 70" value={get('weight_kg')} onChange={e => set('weight_kg', e.target.value)} />
                            </div>
                            <InputField label="Mobile Number" icon={Phone} type="tel" placeholder="+1-555-0123" value={get('mobile')} onChange={e => set('mobile', e.target.value)} required />
                            <TextAreaField label="Home Address" value={get('address')} onChange={e => set('address', e.target.value)} placeholder="Street, City, State, ZIP" />
                            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}>
                                <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertCircle size={13} /> Emergency Contact</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                    <InputField label="Contact Name" icon={User} placeholder="e.g. John Doe" value={get('emergency_contact_name')} onChange={e => set('emergency_contact_name', e.target.value)} />
                                    <InputField label="Contact Phone" icon={Phone} placeholder="+1-555-9999" value={get('emergency_contact_phone')} onChange={e => set('emergency_contact_phone', e.target.value)} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── STEP 3 ── Medical */}
                    {step === 3 && (
                        <>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Medical Background</h2>
                            <TextAreaField label="Known Allergies" value={get('known_allergies')} onChange={e => set('known_allergies', e.target.value)} placeholder="e.g. Penicillin, Peanuts, Latex (or 'None')" />
                            <TextAreaField label="Current Medications" value={get('current_medications')} onChange={e => set('current_medications', e.target.value)} placeholder="List any medications you currently take (or 'None')" />
                            <TextAreaField label="Medical History" value={get('medical_history')} onChange={e => set('medical_history', e.target.value)} placeholder="Previous conditions, surgeries, chronic illnesses…" />
                            <SelectField label="Preferred Primary Doctor" icon={Stethoscope} options={DOCTORS} value={get('preferred_doctor')} onChange={e => set('preferred_doctor', e.target.value)} />
                        </>
                    )}

                    {/* ── STEP 4 ── Review */}
                    {step === 4 && (
                        <>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Review Your Information</h2>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-faint)', marginBottom: '0.5rem', fontWeight: 600 }}>Account</p>
                                <ReviewRow label="Name"  value={form.name}  />
                                <ReviewRow label="Email" value={form.email} />
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-faint)', marginBottom: '0.5rem', fontWeight: 600 }}>Personal</p>
                                <ReviewRow label="Date of Birth" value={form.date_of_birth} />
                                <ReviewRow label="Age"          value={form.age ? `${form.age} years` : null} />
                                <ReviewRow label="Sex"          value={form.sex} />
                                <ReviewRow label="Blood Group"  value={form.blood_group} />
                                <ReviewRow label="Height"       value={form.height_cm ? `${form.height_cm} cm` : null} />
                                <ReviewRow label="Weight"       value={form.weight_kg ? `${form.weight_kg} kg` : null} />
                                <ReviewRow label="Mobile"       value={form.mobile} />
                                <ReviewRow label="Address"      value={form.address} />
                                <ReviewRow label="Emergency Contact" value={form.emergency_contact_name ? `${form.emergency_contact_name} — ${form.emergency_contact_phone}` : null} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-faint)', marginBottom: '0.5rem', fontWeight: 600 }}>Medical</p>
                                <ReviewRow label="Allergies"    value={form.known_allergies} />
                                <ReviewRow label="Medications"  value={form.current_medications} />
                                <ReviewRow label="History"      value={form.medical_history} />
                                <ReviewRow label="Preferred Dr" value={form.preferred_doctor} />
                            </div>
                        </>
                    )}

                    {/* Navigation */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
                        {step > 1 && (
                            <button onClick={back} className="btn btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        )}
                        {step < 4 ? (
                            <button onClick={next} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                Continue <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                {loading ? 'Creating Account…' : <><CheckCircle size={16} /> Create My Account</>}
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
