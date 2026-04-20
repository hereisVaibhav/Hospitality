import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle,
  MessageSquare, AlertCircle
} from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim() || form.message.length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const infoCards = [
    { icon: Phone, label: 'Phone', value: '+1-555-0100', sub: 'Mon – Fri, 8am – 6pm', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { icon: Mail, label: 'Email', value: 'info@hospithub.com', sub: 'We reply within 24 hours', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { icon: MapPin, label: 'Address', value: '123 Medical Center Dr.', sub: 'New York, NY 10021', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { icon: Clock, label: 'Hours', value: 'Emergency: 24/7', sub: 'Outpatient: Mon–Fri 8am–8pm', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="section-eyebrow" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Get In Touch</div>
        <h1>Contact <span className="gradient-text">Us</span></h1>
        <p>Have questions? Our team is here to help. Reach out and we'll get back to you within 24 hours.</p>
      </div>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <div className="contact-grid">
          {/* Left: Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Contact Information
            </h3>
            {infoCards.map((card, i) => (
              <div key={i} className="contact-info-card">
                <div className="contact-icon" style={{ background: card.bg }}>
                  <card.icon size={20} color={card.color} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{card.label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{card.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{card.sub}</div>
                </div>
              </div>
            ))}

            {/* Office Hours Table */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--gradient-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary-light)" /> Office Hours
              </h4>
              {[
                ['Monday – Friday', '8:00 AM – 8:00 PM'],
                ['Saturday', '9:00 AM – 5:00 PM'],
                ['Sunday', '10:00 AM – 2:00 PM'],
                ['Emergency', '24 Hours / 7 Days'],
              ].map(([day, time], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < 3 ? '1px solid var(--glass-border)' : 'none', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{day}</span>
                  <span style={{ fontWeight: 600, color: i === 3 ? '#10b981' : 'var(--text)' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {status === 'success' ? (
              <div style={{
                padding: '3rem 2rem',
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'center'
              }}>
                <CheckCircle size={56} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ marginBottom: '0.75rem' }}>Message Sent!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button onClick={() => setStatus('idle')} className="btn btn-primary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <div style={{ padding: '2.5rem', background: 'var(--gradient-card)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                  <MessageSquare size={22} color="var(--primary-light)" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Send us a Message</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        className="input-field"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                      {errors.name && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        className="input-field"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.email}</p>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <select
                      className="input-field"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a subject...</option>
                      <option>General Inquiry</option>
                      <option>Appointment Help</option>
                      <option>Technical Support</option>
                      <option>Billing & Insurance</option>
                      <option>Feedback / Suggestion</option>
                      <option>Other</option>
                    </select>
                    {errors.subject && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.subject}</p>}
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      className="input-field"
                      placeholder="Describe your question or concern in detail..."
                      style={{ minHeight: '130px' }}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                    {errors.message && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === 'loading'}
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    {status === 'loading' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                        Sending...
                      </span>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
