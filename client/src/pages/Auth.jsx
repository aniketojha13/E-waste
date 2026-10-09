import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  KeyRound
} from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, loading, user } = useContext(AuthContext);

  const searchParams = new URLSearchParams(location.search);
  const requestedRole = searchParams.get('role');
  const isSignupPath = location.pathname === '/signup' || searchParams.get('tab') === 'register';

  const [activeTab, setActiveTab] = useState(isSignupPath ? 'register' : 'login');
  const [isAdminCollectorMode, setIsAdminCollectorMode] = useState(
    requestedRole === 'admin' || requestedRole === 'agent'
  );
  const [staffRole, setStaffRole] = useState(requestedRole === 'admin' ? 'admin' : 'agent');

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

    const targetRole = isAdminCollectorMode ? staffRole : 'customer';
    const res = await login(loginData.username, loginData.password, targetRole);
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

  const fillQuickCredentials = (u, p, role) => {
    setIsAdminCollectorMode(true);
    setStaffRole(role);
    setLoginData({ username: u, password: p });
    setActiveTab('login');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      {/* Top Header Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* Right Corner Button: Admin & Collector Login Toggle */}
        <button
          onClick={() => {
            setIsAdminCollectorMode(!isAdminCollectorMode);
            setActiveTab('login');
            setError('');
          }}
          className="btn btn-outline"
          style={{
            fontSize: '0.8rem',
            padding: '0.35rem 0.75rem',
            color: isAdminCollectorMode ? '#38bdf8' : '#94a3b8',
            borderColor: isAdminCollectorMode ? '#0284c7' : '#1e293b'
          }}
        >
          <ShieldCheck size={14} color={isAdminCollectorMode ? '#38bdf8' : '#94a3b8'} />
          <span>{isAdminCollectorMode ? 'Switch to Customer Login' : 'Admin & Collector Login'}</span>
        </button>
      </div>

      <div className="card">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
            {isAdminCollectorMode ? 'Admin & Collector Portal' : 'Customer Account Access'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {isAdminCollectorMode 
              ? 'Authorized sign-in for Administrators and Field Collection Agents' 
              : 'Sign in to list electronics for doorstep collection & payouts'}
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

        {/* Tab Selector */}
        {!isAdminCollectorMode ? (
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
        ) : (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${staffRole === 'admin' ? 'active' : ''}`}
              onClick={() => { setStaffRole('admin'); setError(''); }}
            >
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
              Administrator
            </button>
            <button
              type="button"
              className={`auth-tab ${staffRole === 'agent' ? 'active' : ''}`}
              onClick={() => { setStaffRole('agent'); setError(''); }}
            >
              <Truck size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
              Collection Agent (Collector)
            </button>
          </div>
        )}

        {/* SIGN IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-input"
                placeholder={isAdminCollectorMode ? (staffRole === 'admin' ? 'admin' : 'agent1') : 'Enter your username'}
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
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn ${isAdminCollectorMode && staffRole === 'admin' ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem' }}
              disabled={loading}
            >
              <LogIn size={16} />
              {loading ? 'Verifying...' : `Sign In as ${isAdminCollectorMode ? (staffRole === 'admin' ? 'Administrator' : 'Collection Agent') : 'Customer'}`}
            </button>

            {/* Quick Demo Test Buttons */}
            {isAdminCollectorMode && (
              <div style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                background: '#0d1424',
                borderRadius: '8px',
                border: '1px solid #1e293b'
              }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <KeyRound size={13} color="#34d399" /> Fast Demo Logins
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => fillQuickCredentials('admin', 'admin123', 'admin')}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
                  >
                    Admin (admin / admin123)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickCredentials('agent1', 'agent123', 'agent')}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
                  >
                    Collector (agent1 / agent123)
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* CUSTOMER REGISTRATION FORM */}
        {activeTab === 'register' && !isAdminCollectorMode && (
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                <label>Email *</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Password"
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
                  placeholder="10-digit mobile"
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
                placeholder="Full address for collection agent pickup"
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem' }}
              disabled={loading}
            >
              <UserPlus size={16} />
              {loading ? 'Creating Account...' : 'Register Customer Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
