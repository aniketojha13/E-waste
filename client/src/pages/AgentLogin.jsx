import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Truck, 
  LogIn, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck,
  Briefcase,
  Lock,
  User
} from 'lucide-react';

const AgentLogin = () => {
  const navigate = useNavigate();
  const { login, loading, user } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already authenticated as agent, redirect to agent dashboard
  useEffect(() => {
    if (user) {
      const role = user.role || user.user?.role;
      if (role === 'agent') {
        navigate('/agent', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please provide your collection agent username and password.');
      return;
    }

    const res = await login(username.trim(), password, 'agent');
    if (res.success) {
      navigate('/agent', { replace: true });
    } else {
      setError(res.message || 'Invalid agent credentials. Please check your username and password.');
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
          color: 'var(--secondary)' 
        }}>
          Field Operations
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
            background: 'rgba(14, 165, 233, 0.14)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            color: 'var(--secondary)',
            marginBottom: '1rem'
          }}>
            <Truck size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Collection Agent Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.45, maxWidth: '340px', margin: '0 auto' }}>
            Access assigned doorstep pickups, verify customer device specs, and record collection drop-offs.
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
            <label htmlFor="agent-username" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} /> Agent Username
            </label>
            <input
              id="agent-username"
              type="text"
              className="form-input"
              placeholder="Enter agent username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="agent-password" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} /> Agent Password
            </label>
            <input
              id="agent-password"
              type="password"
              className="form-input"
              placeholder="Enter agent password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.75rem',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)'
            }}
            disabled={loading}
          >
            <LogIn size={16} />
            {loading ? 'Authenticating Agent...' : 'Sign In as Collection Agent'}
          </button>
        </form>

        {/* Notice to Apply as Agent */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.85rem 1rem',
          background: 'var(--primary-light)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--primary)' }}>
              Want to join our field fleet?
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Earn per verified electronics pickup.
            </div>
          </div>
          <Link
            to="/apply-as-agent"
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
          >
            <Briefcase size={13} /> Apply Now
          </Link>
        </div>

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
            <span style={{ color: 'var(--text-muted)' }}>System Administrator?</span>
            <Link 
              to="/login/admin" 
              style={{ color: '#a78bfa', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <ShieldCheck size={14} /> Admin Login
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

export default AgentLogin;
