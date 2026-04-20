import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity, Shield, Users, Clock, Heart, Calendar, FileText, Zap,
  Phone, Star, ArrowRight, CheckCircle, TrendingUp, Stethoscope,
  BedDouble, AlertTriangle, Pill, ChevronRight, Siren, User,
  LayoutDashboard, Settings, BarChart2, UserCheck
} from 'lucide-react';
import api from '../services/api';

// ─────────────────────────────────────────────────────────────────
// GUEST / MARKETING HOME
// ─────────────────────────────────────────────────────────────────
const GuestHome = ({ navigate }) => {
  const features = [
    { icon: Shield,   title: 'Secure Patient Records',  desc: 'HIPAA-compliant, end-to-end encrypted with role-based access.', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { icon: Calendar, title: 'Smart Scheduling',        desc: 'Real-time slot availability — never get double-booked.', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { icon: Activity, title: 'Real-time Monitoring',    desc: 'Track admissions, bed availability, and patient vitals live.', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { icon: Users,    title: 'Team Collaboration',      desc: 'Seamless communication between doctors and admin staff.', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { icon: FileText, title: 'Digital Prescriptions',   desc: 'Doctors issue digital prescriptions instantly accessible by patients.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { icon: Heart,    title: 'Patient-First Care',      desc: 'Intuitive patient portal for appointments, records and prescriptions.', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];
  const steps = [
    { step: '01', title: 'Create Your Account',  desc: 'Register as a patient in under 2 minutes with your health profile.' },
    { step: '02', title: 'Book an Appointment',  desc: 'Browse available doctors, view real-time slots, pick your time.' },
    { step: '03', title: 'Get Quality Care',      desc: 'Attend your appointment, view prescriptions and records online instantly.' },
  ];
  const stats = [
    { number: '1,200+', label: 'Patients Served' },
    { number: '80+',    label: 'Expert Doctors'   },
    { number: '15+',    label: 'Departments'       },
    { number: '99.9%',  label: 'System Uptime'     },
  ];
  const testimonials = [
    { text: '"HospitHub completely changed how our clinic operates. Scheduling is seamless and patient satisfaction has skyrocketed."', name: 'Dr. Sarah Johnson', role: 'Cardiologist',     initials: 'SJ', color: '#6366f1' },
    { text: '"I can book appointments in seconds and see my prescriptions instantly. This is healthcare done right."',                  name: 'John Doe',         role: 'Patient',           initials: 'JD', color: '#10b981' },
    { text: '"Managing 80+ staff and hundreds of daily appointments is now effortless. The admin tools are outstanding."',              name: 'Emily Foster',     role: 'Hospital Admin',    initials: 'EF', color: '#f59e0b' },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-orb hero-bg-orb-1" />
        <div className="hero-bg-orb hero-bg-orb-2" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge"><Zap size={12} /> Next-Generation Hospital Management</div>
          <h1 className="hero-title">Modern Healthcare,<br /><span className="gradient-text">Simplified.</span></h1>
          <p className="hero-subtitle">HospitHub empowers hospitals with intelligent scheduling, real-time slot booking, secure patient records, and seamless collaboration.</p>
          <div className="hero-cta">
            <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></button>
            <Link to="/about" className="btn btn-secondary btn-lg">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Why HospitHub</div>
            <h2 className="section-title">Everything your hospital needs</h2>
            <p className="section-subtitle">A complete suite of tools designed for every role.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg }}><f.icon size={24} color={f.color} /></div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-description">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 0', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">How It Works</div>
            <h2 className="section-title">Get started in minutes</h2>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{s.step}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-description">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Testimonials</div>
            <h2 className="section-title">Trusted by healthcare professionals</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, si) => <Star key={si} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: `${t.color}25`, color: t.color }}>{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ padding: '3rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to <span className="gradient-text">transform</span> your hospital?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>Join hundreds of healthcare providers already using HospitHub to deliver better care.</p>
            <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">Start for Free <ArrowRight size={18} /></button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '1rem' }}>Hospit<span className="gradient-text">Hub</span></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: '260px' }}>Next-generation hospital management for modern healthcare providers.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '1rem' }}>Platform</h4>
              <ul className="footer-links">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/about">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '1rem' }}>Company</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '1rem' }}>Contact</h4>
              <ul className="footer-links">
                <li><a href="tel:+15550100">+1-555-0100</a></li>
                <li><a href="mailto:info@hospithub.com">info@hospithub.com</a></li>
                <li><a href="#">123 Medical Center Dr.</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 HospitHub. All rights reserved.</span>
            <span>Built with ♥ for better healthcare</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// PATIENT HOME
// ─────────────────────────────────────────────────────────────────
const PatientHome = ({ user, navigate }) => {
  const [appointments, setAppointments] = useState([]);
  const [emergencySummary, setEmergencySummary] = useState(null);
  const firstName = user?.name?.split(' ')[0] || 'Patient';

  useEffect(() => {
    Promise.all([
      api.get(`/appointments?patient=${encodeURIComponent(user?.name || '')}`),
      api.get('/emergency/summary'),
    ]).then(([aRes, eRes]) => {
      setAppointments(aRes.data);
      setEmergencySummary(eRes.data);
    }).catch(() => {});
  }, [user]);

  const upcoming = appointments.filter(a => a.status === 'booked' || a.status === 'in-progress');
  const nextAppt  = upcoming[0];

  const quickLinks = [
    { label: 'Book Appointment',  path: '/dashboard/my-appointments', icon: Calendar,      color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  desc: 'Schedule a new visit'             },
    { label: 'Emergency Ward',    path: '/dashboard/emergency',        icon: Siren,         color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   desc: 'View beds & request emergency'    },
    { label: 'Medical Records',   path: '/dashboard/records',          icon: FileText,      color: '#10b981', bg: 'rgba(16,185,129,0.1)',  desc: 'Your health history'              },
    { label: 'My Prescriptions',  path: '/dashboard/prescriptions',    icon: Pill,          color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  desc: 'Medications & refills'            },
  ];

  const healthTips = [
    '💧 Drink at least 8 glasses of water daily.',
    '🏃 30 minutes of moderate exercise can reduce heart disease risk by 35%.',
    '😴 Adults need 7–9 hours of sleep per night for optimal health.',
    '🥦 A diet rich in vegetables cuts chronic disease risk significantly.',
  ];
  const tip = healthTips[new Date().getDay() % healthTips.length];

  return (
    <div className="fade-in" style={{ padding: '2.5rem 0' }}>
      {/* Hero greeting */}
      <section style={{ position: 'relative', padding: '3rem 0 2.5rem', marginBottom: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.06) 100%)', border: '1px solid rgba(16,185,129,0.15)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(6,182,212,0.2))', border: '2px solid rgba(16,185,129,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={28} color="#10b981" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Patient Portal</div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', margin: 0 }}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, <span style={{ color: '#10b981' }}>{firstName}!</span></h1>
              <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Here's your health overview for today</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LayoutDashboard size={15} /> Full Dashboard
            </button>
          </div>

          {/* Next appointment banner */}
          {nextAppt ? (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Clock size={20} color="#f59e0b" flexShrink={0} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Next Appointment</span>
                <p style={{ margin: '0.1rem 0 0', fontWeight: 600 }}>{nextAppt.doctor} · {nextAppt.date} at {nextAppt.time}</p>
              </div>
              <button onClick={() => navigate('/dashboard/my-appointments')} className="btn btn-sm" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>View</button>
            </div>
          ) : (
            <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Calendar size={18} color="#818cf8" />
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>No upcoming appointments. <button onClick={() => navigate('/dashboard/my-appointments')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Book one now →</button></p>
            </div>
          )}
        </div>
      </section>

      {/* Quick links */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--primary-light)" /> Quick Access
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {quickLinks.map((link, i) => (
              <button key={i} onClick={() => navigate(link.path)} style={{ background: link.bg, border: `1px solid ${link.color}30`, borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${link.color}20`; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${link.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <link.icon size={22} color={link.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{link.label}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{link.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency + Health Tip row */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Emergency status */}
            {emergencySummary && (
              <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04))', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Siren size={18} color="#ef4444" />
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Emergency Ward Status</h3>
                  <span className="emergency-pulse-badge" style={{ marginLeft: 'auto' }}>LIVE</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Available Beds', value: emergencySummary.available, color: '#10b981' },
                    { label: 'Total Beds',     value: emergencySummary.total_beds, color: '#818cf8' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/dashboard/emergency')} className="btn btn-danger btn-sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <BedDouble size={14} /> View Emergency Wards
                </button>
              </div>
            )}

            {/* Health tip */}
            <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Health Tip of the Day</div>
                <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-muted)' }}>{tip}</p>
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-faint)' }}>Updated daily for your wellbeing</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// DOCTOR HOME
// ─────────────────────────────────────────────────────────────────
const DoctorHome = ({ user, navigate }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [emergency,    setEmergency]    = useState(null);
  const firstName = user?.name?.split(' ')[0] || 'Doctor';
  const todayStr  = new Date().toISOString().split('T')[0];
  const displayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    Promise.all([
      api.get(`/appointments?doctor=${encodeURIComponent(user?.name || '')}`),
      api.get(`/patients?doctor=${encodeURIComponent(user?.name || '')}`),
      api.get('/emergency/summary'),
    ]).then(([aRes, pRes, eRes]) => {
      setAppointments(aRes.data);
      setPatients(pRes.data);
      setEmergency(eRes.data);
    }).catch(() => {});
  }, [user]);

  const todayAppts  = appointments.filter(a => a.date === todayStr);
  const pending     = appointments.filter(a => a.status === 'booked').length;
  const inProg      = appointments.filter(a => a.status === 'in-progress');

  const quickLinks = [
    { label: 'My Appointments',   path: '/dashboard/appointments', icon: Calendar,    color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  badge: pending },
    { label: 'My Patients',       path: '/dashboard/patients',     icon: Users,       color: '#10b981', bg: 'rgba(16,185,129,0.1)',  badge: patients.length },
    { label: 'Prescriptions',     path: '/dashboard/prescriptions',icon: Pill,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  badge: null },
    { label: 'Emergency Wards',   path: '/dashboard/emergency',    icon: Siren,       color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   badge: emergency?.occupied },
  ];

  const statusColors = { completed: '#10b981', 'in-progress': '#3b82f6', booked: '#f59e0b', cancelled: '#ef4444' };

  return (
    <div className="fade-in" style={{ padding: '2.5rem 0' }}>
      {/* Doctor greeting hero */}
      <section style={{ position: 'relative', padding: '3rem 0 2.5rem', marginBottom: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 270, height: 270, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(6,182,212,0.2))', border: '2px solid rgba(99,102,241,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Stethoscope size={28} color="#818cf8" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Doctor Portal</div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: 0 }}>Your Patients Await, <span style={{ color: '#818cf8' }}>{firstName}!</span></h1>
              <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.88rem' }}>{displayDate} — {todayAppts.length} appointments today</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LayoutDashboard size={15} /> Dashboard
            </button>
          </div>

          {/* In-progress alert */}
          {inProg.length > 0 && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6', animation: 'pulse-dot 1.5s infinite', flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#93c5fd' }}>
                <strong>{inProg[0].patient}</strong> is currently in session
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats row */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {[
              { label: "Today's Patients", value: todayAppts.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  icon: Calendar },
              { label: 'Pending',          value: pending,            color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: Clock    },
              { label: 'My Patients',      value: patients.length,    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  icon: Users    },
              { label: 'Emergency Beds',   value: emergency?.occupied ?? '—', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: BedDouble },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
                <div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.15rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links + today's schedule */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Quick links */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={17} color="var(--primary-light)" /> Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {quickLinks.map((l, i) => (
                  <button key={i} onClick={() => navigate(l.path)} className="quick-action-btn">
                    <div style={{ width: 34, height: 34, borderRadius: '8px', background: l.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <l.icon size={17} color={l.color} />
                    </div>
                    <span style={{ flex: 1 }}>{l.label}</span>
                    {l.badge !== null && l.badge > 0 && (
                      <span style={{ background: l.bg, color: l.color, padding: '0.15rem 0.55rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>{l.badge}</span>
                    )}
                    <ChevronRight size={15} color="var(--text-faint)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Today's schedule */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={17} color="#f59e0b" /> Today's Schedule</h3>
              {todayAppts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <Calendar size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                  <p style={{ fontSize: '0.88rem' }}>No appointments today</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {todayAppts.map(a => {
                    const c = statusColors[a.status] || '#94a3b8';
                    return (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={16} color={c} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{a.patient}</p>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>{a.time}</p>
                        </div>
                        <span className="badge" style={{ background: `${c}15`, color: c, fontSize: '0.7rem' }}>{a.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// ADMIN HOME
// ─────────────────────────────────────────────────────────────────
const AdminHome = ({ user, navigate }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [emergency,    setEmergency]    = useState(null);
  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const todayStr  = new Date().toISOString().split('T')[0];

  useEffect(() => {
    Promise.all([
      api.get('/appointments'),
      api.get('/patients'),
      api.get('/emergency/summary'),
    ]).then(([aRes, pRes, eRes]) => {
      setAppointments(aRes.data);
      setPatients(pRes.data);
      setEmergency(eRes.data);
    }).catch(() => {});
  }, []);

  const todayAppts = appointments.filter(a => a.date === todayStr);
  const admitted   = patients.filter(p => p.admission_status === 'admitted');

  const adminModules = [
    { label: 'Manage Staff',      path: '/dashboard/staff',       icon: Users,       color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  desc: 'Add, edit, remove staff'     },
    { label: 'Departments',       path: '/dashboard/departments', icon: LayoutDashboard, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', desc: 'Manage hospital departments'  },
    { label: 'All Appointments',  path: '/dashboard/appointments',icon: Calendar,    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  desc: "View everyone's schedule"   },
    { label: 'Patient Records',   path: '/dashboard/patients',    icon: UserCheck,   color: '#10b981', bg: 'rgba(16,185,129,0.1)',  desc: 'All registered patients'      },
    { label: 'Reports',           path: '/dashboard/reports',     icon: BarChart2,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  desc: 'Analytics and insights'       },
    { label: 'Emergency Wards',   path: '/dashboard/emergency',   icon: Siren,       color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   desc: 'Live bed management'          },
    { label: 'Settings',          path: '/dashboard/settings',    icon: Settings,    color: '#64748b', bg: 'rgba(100,116,139,0.1)', desc: 'System configuration'         },
  ];

  const statusColors = { completed: '#10b981', 'in-progress': '#3b82f6', booked: '#f59e0b', cancelled: '#ef4444' };

  return (
    <div className="fade-in" style={{ padding: '2.5rem 0' }}>
      {/* Admin hero */}
      <section style={{ position: 'relative', padding: '3rem 0 2.5rem', marginBottom: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.07), rgba(99,102,241,0.06))', border: '1px solid rgba(245,158,11,0.15)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 270, height: 270, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(99,102,241,0.15))', border: '2px solid rgba(245,158,11,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={28} color="#f59e0b" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Admin Control Center</div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: 0 }}>Hospital Command Center, <span style={{ color: '#f59e0b' }}>{firstName}</span></h1>
              <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontSize: '0.88rem' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LayoutDashboard size={15} /> Full Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Live stats */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '1rem' }}>
            {[
              { label: "Today's Appointments", value: todayAppts.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: Calendar   },
              { label: 'Total Patients',        value: patients.length,   color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: Users      },
              { label: 'Admitted Now',          value: admitted.length,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: BedDouble  },
              { label: 'Emergency Beds Free',   value: emergency?.available ?? '—', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: Siren },
              { label: 'Occupancy Rate',        value: emergency ? `${emergency.occupancy_pct}%` : '—', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', icon: Activity },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
                <div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module grid + today activity */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Modules */}
            <div className="card" style={{ gridColumn: 'span 1' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><LayoutDashboard size={17} color="#f59e0b" /> Manage Modules</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                {adminModules.map((m, i) => (
                  <button key={i} onClick={() => navigate(m.path)} style={{ background: m.bg, border: `1px solid ${m.color}25`, borderRadius: '12px', padding: '0.9rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = ''; }}
                  >
                    <m.icon size={18} color={m.color} style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem' }}>{m.label}</div>
                    <div style={{ color: 'var(--text-faint)', fontSize: '0.7rem' }}>{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Today activity */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={17} color="var(--primary-light)" /> Today's Activity</h3>
              {todayAppts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <Calendar size={30} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem' }}>No activity today</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {todayAppts.slice(0, 6).map(a => {
                    const c = statusColors[a.status] || '#94a3b8';
                    return (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.83rem' }}>{a.patient}</p>
                          <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '0.72rem' }}>{a.doctor} · {a.time}</p>
                        </div>
                        <span className="badge" style={{ background: `${c}15`, color: c, fontSize: '0.68rem' }}>{a.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// ROOT EXPORT — branches by user role
// ─────────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  if (!user) return <GuestHome navigate={navigate} />;
  if (user.role === 'patient') return <PatientHome user={user} navigate={navigate} />;
  if (user.role === 'doctor')  return <DoctorHome  user={user} navigate={navigate} />;
  if (user.role === 'admin')   return <AdminHome   user={user} navigate={navigate} />;
  return <GuestHome navigate={navigate} />;
};

export default Home;
