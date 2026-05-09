import React from 'react';
import { Stethoscope } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading HospitHub...' }) => {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: '#080b14',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            gap: '1.5rem'
        }}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))',
                    border: '2px solid rgba(99,102,241,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    <Stethoscope size={40} color="#818cf8" />
                </div>
                <div style={{
                    position: 'absolute',
                    inset: '-10px',
                    borderRadius: '30px',
                    border: '2px solid transparent',
                    borderTopColor: '#6366f1',
                    borderBottomColor: '#06b6d4',
                    animation: 'spin 2s linear infinite'
                }} />
            </div>
            
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'white' }}>
                    Hospit<span className="gradient-text">Hub</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {message}
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
