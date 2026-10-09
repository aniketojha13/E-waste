import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldCheck, 
  LogIn, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  Truck, 
  UserCheck,
  Lock,
  User
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading, user } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already authenticated as admin, redirect to admin dashboard
  useEffect(() => {
    if (user) {
      const role = user.role || user.user?.role;
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both administrator username and password.');
      return;
    }

    const res = await login(username.trim(), password, 'admin');
    if (res.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(res.message || 'Invalid administrator credentials. Access restricted.');
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '2.5rem auto', padding: '0 1rem' }}>
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <Link 
          to="/" 
          className="btn btn-outline" 
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span style={{ 
          fontSize: '0.72rem', 
          fontWeight: 700, 
          letterSpacing: '0.06em', 
          textTransform: 'uppercase', 
          color: '#a78bfa' 
        }}>
          Control Center
        </span>
      </div>

      <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(139, 92, 246, 0.14)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#a78bfa',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Administrator Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.45, maxWidth: '340px', margin: '0 auto' }}>
            Access system management, agent authorizations, financial ledgers, and platform operations.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-username" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} /> Admin Username
            </label>
            <input
              id="admin-username"
              type="text"
              className="form-input"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} /> Admin Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="Enter administrator password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
            }}
            disabled={loading}
          >
            <LogIn size={16} />
            {loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        {/* Portal Switch Links */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          fontSize: '0.825rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Are you a Field Collector?</span>
            <Link 
              to="/login/agent" 
              style={{ color: 'var(--secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <Truck size={14} /> Agent Login
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Looking for Customer Portal?</span>
            <Link 
              to="/login" 
              style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <UserCheck size={14} /> Customer Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
