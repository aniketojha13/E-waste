import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Truck, 
  User, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, loading, user } = useContext(AuthContext);

  // Read initial mode from URL or query
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role');
  const isSignupPath = location.pathname === '/signup' || searchParams.get('tab') === 'register';

  const [activeTab, setActiveTab] = useState(isSignupPath ? 'register' : 'login');
  const [isStaffMode, setIsStaffMode] = useState(initialRole === 'admin' || initialRole === 'agent');
  const [staffRole, setStaffRole] = useState(initialRole === 'admin' ? 'admin' : 'agent');

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Register form state (Fixed field names matching backend: name, username, email, password, mobile, address)
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'agent') navigate('/agent');
      else navigate('/customer');
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginData.username || !loginData.password) {
      setError('Please enter both username and password.');
      return;
    }

    const targetRole = isStaffMode ? staffRole : 'customer';
    const res = await login(loginData.username, loginData.password, targetRole);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerData.name || !registerData.username || !registerData.email || !registerData.password) {
      setError('Please complete all required fields (Name, Username, Email, Password).');
      return;
    }

    const res = await signup(registerData);
    if (res.success) {
      setSuccess('Account created successfully! Redirecting to Customer Dashboard...');
      setTimeout(() => {
        navigate('/customer');
      }, 1200);
    } else {
      setError(res.message);
    }
  };

  const fillQuickCredentials = (u, p, role) => {
    setIsStaffMode(true);
    setStaffRole(role);
    setLoginData({ username: u, password: p });
    setActiveTab('login');
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto', position: 'relative' }}>
      {/* Top Controls: Back and Corner Staff Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* Corner Login Option for Admin / Agent */}
        <button
          onClick={() => {
            setIsStaffMode(!isStaffMode);
            setActiveTab('login');
            setError('');
          }}
          style={{
            background: isStaffMode 
              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(14, 165, 233, 0.25) 100%)' 
              : 'rgba(30, 41, 59, 0.7)',
            border: isStaffMode ? '1px solid #06b6d4' : '1px solid var(--border)',
            color: isStaffMode ? '#38bdf8' : '#94a3b8',
            padding: '0.45rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isStaffMode ? '0 0 15px rgba(6, 182, 212, 0.3)' : 'none'
          }}
        >
          <ShieldCheck size={16} color={isStaffMode ? '#38bdf8' : '#94a3b8'} />
          <span>{isStaffMode ? 'Staff Mode Active' : 'Staff / Agent Login'}</span>
        </button>
      </div>

      <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Decorative corner glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          background: isStaffMode ? 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
            {isStaffMode ? 'Staff & Operations Portal' : 'Welcome to E-Waste Portal'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {isStaffMode 
              ? 'Authorized access for Admins and Collection Agents' 
              : 'Sign in to recycle electronics or manage your submissions'}
          </p>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Unified Tabs (Shown only in Customer Mode) */}
        {!isStaffMode ? (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              <LogIn size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              <UserPlus size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
              Create Account
            </button>
          </div>
        ) : (
          /* Staff Role Toggle in Staff Mode */
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.35rem',
            borderRadius: '12px',
            marginBottom: '1.75rem',
            border: '1px solid var(--border)'
          }}>
            <button
              type="button"
              className={`auth-tab ${staffRole === 'admin' ? 'active' : ''}`}
              style={staffRole === 'admin' ? { background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' } : {}}
              onClick={() => { setStaffRole('admin'); setError(''); }}
            >
              <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
              Admin Portal
            </button>
            <button
              type="button"
              className={`auth-tab ${staffRole === 'agent' ? 'active' : ''}`}
              onClick={() => { setStaffRole('agent'); setError(''); }}
            >
              <Truck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
              Collection Agent
            </button>
          </div>
        )}

        {/* ─── TAB: SIGN IN ────────────────────────────────────────── */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                placeholder={isStaffMode ? (staffRole === 'admin' ? 'e.g. admin' : 'e.g. agent1') : 'Enter your username'}
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn ${isStaffMode && staffRole === 'admin' ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? 'Authenticating...' : `Sign In as ${isStaffMode ? (staffRole === 'admin' ? 'Admin' : 'Agent') : 'Customer'}`}
            </button>

            {/* Quick Demo Credentials in Staff Mode */}
            {isStaffMode && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '10px',
                border: '1px dashed rgba(148, 163, 184, 0.2)'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <KeyRound size={14} color="#34d399" /> Quick Test Credentials
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => fillQuickCredentials('admin', 'admin123', 'admin')}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                  >
                    Use Admin (admin123)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickCredentials('agent1', 'agent123', 'agent')}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
                  >
                    Use Agent (agent123)
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* ─── TAB: CREATE ACCOUNT (CUSTOMER) ────────────────────── */}
        {activeTab === 'register' && !isStaffMode && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alice Smith"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Create password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="10-digit number"
                  value={registerData.mobile}
                  onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pick-up Address</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Address for scheduled e-waste pickup"
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              <UserPlus size={18} />
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
