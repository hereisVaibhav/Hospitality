import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ManageStaffPage from './pages/ManageStaffPage';
import DepartmentsPage from './pages/DepartmentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import MyPatientsPage from './pages/MyPatientsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import EmergencyWardsPage from './pages/EmergencyWardsPage';
import TreatmentWardsPage from './pages/TreatmentWardsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import './styles/global.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar" style={{ position: 'relative' }}>
            {/* Logo */}
            <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
                Hospit<span>Hub</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end onClick={() => setMenuOpen(false)}>
                    Home
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
                    About
                </NavLink>
                <NavLink to="/contact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
                    Contact
                </NavLink>

                {/* Mobile-only user actions */}
                <div style={{ display: 'none' }} className="mobile-user-actions">
                    {user ? (
                        <>
                            <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                                Dashboard
                            </button>
                            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', width: '100%', textAlign: 'left' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
                    )}
                </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {user ? (
                    <>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <LayoutDashboard size={14} /> Dashboard
                        </button>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Hi, {user.name?.split(' ')[0]}
                        </span>
                        <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <LogOut size={14} /> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
                )}
                {/* Hamburger */}
                <button
                    className="hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={22} color="white" /> : <Menu size={22} color="white" />}
                </button>
            </div>

            {/* Mobile open: show user area too */}
            <style>{`
                @media (max-width: 768px) {
                    .mobile-user-actions { display: block !important; }
                    .nav-actions .btn, .nav-actions span { display: none; }
                    .hamburger { display: flex !important; }
                }
            `}</style>
        </nav>
    );
};

const AppContent = () => {
    const { loading } = useAuth();

    if (loading) return <LoadingScreen message="Initialising HospitHub..." />;

    return (
        <div className="app">
            <Navbar />
            <main className="container smooth-reveal" style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/staff" element={<ManageStaffPage />} />
                    <Route path="/dashboard/departments" element={<DepartmentsPage />} />
                    <Route path="/dashboard/reports" element={<ReportsPage />} />
                    <Route path="/dashboard/settings" element={<SettingsPage />} />
                    <Route path="/dashboard/appointments" element={<MyAppointmentsPage />} />
                    <Route path="/dashboard/patients" element={<MyPatientsPage />} />
                    <Route path="/dashboard/prescriptions" element={<PrescriptionsPage />} />
                    <Route path="/dashboard/my-appointments" element={<PatientAppointmentsPage />} />
                    <Route path="/dashboard/records" element={<MedicalRecordsPage />} />
                    <Route path="/dashboard/emergency" element={<EmergencyWardsPage />} />
                    <Route path="/dashboard/treatment" element={<TreatmentWardsPage />} />
                </Routes>
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router basename="/Hospitality">
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
