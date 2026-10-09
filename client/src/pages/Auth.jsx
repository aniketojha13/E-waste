import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LogIn, 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, loading, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const searchParams = new URLSearchParams(location.search);
  const requestedRole = searchParams.get('role');
  const isSignupPath = location.pathname === '/signup' || searchParams.get('tab') === 'register';

  // Dedicated routes for Admin and Agent login
  useEffect(() => {
    if (requestedRole === 'admin') {
      navigate('/login/admin', { replace: true });
    } else if (requestedRole === 'agent') {
      navigate('/login/agent', { replace: true });
    }
  }, [requestedRole, navigate]);

  const [activeTab, setActiveTab] = useState(isSignupPath ? 'register' : 'login');

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

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

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      const role = user.role || user.user?.role;
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'agent') navigate('/agent', { replace: true });
      else if (role === 'customer') navigate('/customer', { replace: true });
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginData.username || !loginData.password) {
      setError('Please provide your username and password.');
      return;
    }

    const res = await login(loginData.username, loginData.password, 'customer');
    if (!res.success) {
      setError(res.message);
    } else {
      const role = res.user?.role || res.user?.user?.role;
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'agent') navigate('/agent', { replace: true });
      else navigate('/customer', { replace: true });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerData.name || !registerData.username || !registerData.email || !registerData.password) {
      setError('Name, Username, Email, and Password are all required.');
      return;
    }

    const res = await signup(registerData);
    if (res.success) {
      setSuccess('Account created successfully! Taking you to customer portal...');
      setTimeout(() => {
        navigate('/customer');
      }, 1200);
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Top Bar: Back & Theme Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.825rem' }}>
          <ArrowLeft size={14} /> Back to Home
        </button>

        {/* Dedicated corner Light / Dark mode toggle switch */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
          style={{ width: '36px', height: '36px' }}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
        </button>
      </div>

      <div className="card">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Customer Account Access
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Sign in to list electronics for doorstep collection & instant buyback payouts
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Selector: Sign In vs Create Account */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            <LogIn size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            <UserPlus size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
            Create Account
          </button>
        </div>

        {/* SIGN IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your customer username"
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
                placeholder="Enter your account password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              disabled={loading}
            >
              <LogIn size={16} />
              {loading ? 'Verifying...' : 'Sign In as Customer'}
            </button>
          </form>
        )}

        {/* CUSTOMER REGISTRATION FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Choose a username"
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
                  placeholder="Enter your email address"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Create password (min 6 characters)"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Mobile number"
                  value={registerData.mobile}
                  onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Doorstep Pickup Address</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Street address, house no., city, pincode"
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              disabled={loading}
            >
              <UserPlus size={16} />
              {loading ? 'Creating Account...' : 'Register Customer Account'}
            </button>
          </form>
        )}

        {/* Clean Footer links for Staff redirection */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Staff Member?</span>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <Link to="/login/agent" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>
              Agent Sign In →
            </Link>
            <Link to="/login/admin" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
              Admin Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
