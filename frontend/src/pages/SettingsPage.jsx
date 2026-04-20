import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, Moon, Globe, Database, Mail, Clock } from 'lucide-react';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
        darkMode: true,
        twoFactorAuth: true,
        autoBackup: true,
        sessionTimeout: '30',
        language: 'en',
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <div onClick={onChange} style={{
            width: '48px', height: '26px', borderRadius: '13px', cursor: 'pointer',
            background: checked ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
            position: 'relative', transition: 'background 0.3s ease',
        }}>
            <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                position: 'absolute', top: '3px', left: checked ? '25px' : '3px',
                transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }} />
        </div>
    );

    const settingSections = [
        {
            title: 'Notifications', icon: Bell, color: '#3b82f6', items: [
                { label: 'Email Notifications', desc: 'Receive alerts and updates via email', key: 'emailNotifications', type: 'toggle' },
                { label: 'SMS Notifications', desc: 'Get appointment reminders via SMS', key: 'smsNotifications', type: 'toggle' },
            ]
        },
        {
            title: 'Security', icon: Shield, color: '#10b981', items: [
                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', key: 'twoFactorAuth', type: 'toggle' },
                { label: 'Session Timeout (minutes)', desc: 'Auto-logout after inactivity', key: 'sessionTimeout', type: 'select', options: ['15', '30', '60', '120'] },
            ]
        },
        {
            title: 'Appearance', icon: Moon, color: '#8b5cf6', items: [
                { label: 'Dark Mode', desc: 'Use dark theme across the application', key: 'darkMode', type: 'toggle' },
                { label: 'Language', desc: 'Set the display language', key: 'language', type: 'select', options: [{ v: 'en', l: 'English' }, { v: 'es', l: 'Spanish' }, { v: 'fr', l: 'French' }] },
            ]
        },
        {
            title: 'System', icon: Database, color: '#f59e0b', items: [
                { label: 'Maintenance Mode', desc: 'Temporarily disable access for non-admin users', key: 'maintenanceMode', type: 'toggle' },
                { label: 'Auto Backup', desc: 'Automatically back up data daily', key: 'autoBackup', type: 'toggle' },
            ]
        },
    ];

    return (
        <div className="fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-icon" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>System <span style={{ color: 'var(--primary)' }}>Settings</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure application preferences and system options</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {settingSections.map((section, i) => (
                    <div key={i} className="card glass">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ padding: '0.6rem', background: `${section.color}15`, borderRadius: '10px' }}>
                                <section.icon size={22} color={section.color} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{section.title}</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {section.items.map(item => (
                                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>{item.label}</p>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>{item.desc}</p>
                                    </div>
                                    {item.type === 'toggle' ? (
                                        <ToggleSwitch checked={settings[item.key]} onChange={() => toggleSetting(item.key)} />
                                    ) : (
                                        <select
                                            className="input-field"
                                            value={settings[item.key]}
                                            onChange={e => setSettings(prev => ({ ...prev, [item.key]: e.target.value }))}
                                            style={{ width: 'auto', minWidth: '100px' }}
                                        >
                                            {item.options.map(opt =>
                                                typeof opt === 'object'
                                                    ? <option key={opt.v} value={opt.v}>{opt.l}</option>
                                                    : <option key={opt} value={opt}>{opt}</option>
                                            )}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button className="btn btn-primary" style={{ padding: '0.75rem 3rem' }} onClick={() => alert('Settings saved successfully!')}>
                    Save All Changes
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
