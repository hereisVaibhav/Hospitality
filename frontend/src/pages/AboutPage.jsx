import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Award, Users, Zap, Shield, Star, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Cardiologist', specialty: 'Cardiology', initials: 'SJ', color: '#6366f1', experience: '15 yrs' },
    { name: 'Dr. Michael Chen', role: 'Head of Neurology', specialty: 'Neurology', initials: 'MC', color: '#06b6d4', experience: '12 yrs' },
    { name: 'Dr. Emily Davis', role: 'Pediatric Specialist', specialty: 'Pediatrics', initials: 'ED', color: '#10b981', experience: '10 yrs' },
    { name: 'Dr. Robert Martinez', role: 'Orthopedic Surgeon', specialty: 'Orthopedics', initials: 'RM', color: '#f59e0b', experience: '18 yrs' },
    { name: 'Dr. Priya Sharma', role: 'Dermatology Lead', specialty: 'Dermatology', initials: 'PS', color: '#8b5cf6', experience: '9 yrs' },
    { name: 'Jane Foster', role: 'Hospital Administrator', specialty: 'Administration', initials: 'JF', color: '#ef4444', experience: '20 yrs' },
  ];

  const values = [
    { icon: Heart, title: 'Patient-First', desc: 'Every decision we make centers around improving patient outcomes and experience.', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { icon: Shield, title: 'Data Privacy', desc: 'HIPAA-compliant security ensures your health information is always protected.', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards in both medical care and technology.', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { icon: Zap, title: 'Innovation', desc: 'Constantly evolving to harness the latest in healthcare technology and AI.', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  const milestones = [
    { year: '2018', event: 'HospitHub founded with a vision of digital-first healthcare.' },
    { year: '2020', event: 'Expanded to 10+ hospital partners across 3 states.' },
    { year: '2022', event: 'Launched AI-powered appointment scheduling system.' },
    { year: '2024', event: 'Served 1,000+ patients and onboarded 80+ specialist doctors.' },
    { year: '2026', event: 'Next-generation platform launch with real-time slot booking.' },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="page-header">
        <div className="section-eyebrow" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Our Story</div>
        <h1>About <span className="gradient-text">HospitHub</span></h1>
        <p>We're on a mission to make high-quality healthcare accessible, efficient, and transparent for everyone.</p>
      </div>

      {/* Mission */}
      <div className="container">
        <div style={{
          padding: '3rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '24px',
          marginBottom: '5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <div className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>Our Mission</div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
              Technology that <span className="gradient-text">heals</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              HospitHub was built because we believe that great healthcare shouldn't be hindered by administrative inefficiency. We connect patients with the right doctors at the right time, backed by secure, modern technology.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { num: '1,200+', label: 'Patients Served' },
              { num: '80+', label: 'Expert Doctors' },
              { num: '15+', label: 'Departments' },
              { num: '8 yrs', label: 'Experience' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="stat-number" style={{ fontSize: '1.8rem' }}>{s.num}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div style={{ marginBottom: '5rem' }}>
          <div className="section-header">
            <div className="section-eyebrow">Core Values</div>
            <h2 className="section-title">What drives us</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div style={{ width: 48, height: 48, background: v.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <v.icon size={22} color={v.color} />
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '5rem' }}>
          <div className="section-header">
            <div className="section-eyebrow">Our Journey</div>
            <h2 className="section-title">Milestones</h2>
          </div>
          <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid var(--glass-border)' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ marginBottom: '2rem', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '-2.6rem',
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  boxShadow: '0 0 10px var(--primary-glow)'
                }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  {m.year}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{m.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: '5rem' }}>
          <div className="section-header">
            <div className="section-eyebrow">Our Team</div>
            <h2 className="section-title">Meet our experts</h2>
            <p className="section-subtitle">World-class healthcare professionals dedicated to your wellbeing.</p>
          </div>
          <div className="team-grid">
            {team.map((t, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar" style={{ background: `${t.color}20`, color: t.color, border: `2px solid ${t.color}40` }}>
                  {t.initials}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{t.name}</h3>
                <p style={{ color: 'var(--primary-light)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t.role}</p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: `${t.color}15`, color: t.color }}>{t.specialty}</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{t.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to <span className="gradient-text">experience better care?</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Join hundreds of patients and healthcare professionals on HospitHub.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary btn-lg">Get Started <ArrowRight size={18} /></Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
