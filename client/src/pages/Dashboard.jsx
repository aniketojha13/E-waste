import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Truck, 
  UserCheck, 
  Bot, 
  Sparkles, 
  Leaf, 
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

const Dashboard = ({ onOpenAiBot }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirect automatically when user is logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'agent') {
        navigate('/agent', { replace: true });
      } else if (user.role === 'customer') {
        navigate('/customer', { replace: true });
      }
    }
  }, [user, navigate]);

  // If user is already logged in, show their active session hub instead of login cards!
  if (user) {
    const roleTitle = user.role === 'admin' ? 'Administrator' : user.role === 'agent' ? 'Collection Agent' : 'Customer';
    const rolePath = user.role === 'admin' ? '/admin' : user.role === 'agent' ? '/agent' : '/customer';

    return (
      <div style={{ maxWidth: '820px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card">
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', marginBottom: '1rem', color: '#10b981' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Active Session Detected
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            You are currently logged in as <strong style={{ color: '#f8fafc' }}>{user.name || user.username}</strong> ({roleTitle}).
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to={rolePath} className="btn btn-primary">
              Go to My {roleTitle} Dashboard <ArrowRight size={16} />
            </Link>
            <button onClick={onOpenAiBot} className="btn btn-outline">
              <Bot size={16} /> EcoBot Device Analyzer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Visitor view (when NOT logged in)
  return (
    <div style={{ maxWidth: '1060px', margin: '1rem auto' }}>
      {/* Hero Section */}
      <div className="card title-header" style={{ padding: '2.5rem 2rem', background: '#0e1626' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.3rem 0.85rem', borderRadius: '9999px', marginBottom: '1rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
          <Leaf size={14} /> Certified Electronic Recycling & Payout Network
        </div>
        <h1>Responsible E-Waste Disposal & Instant Valuation</h1>
        <p>
          Schedule doorstep pickup for old electronics, connect with authorized local collection agents, receive instant payouts, and measure carbon emission reductions with AI.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Get Started as Customer <ArrowRight size={16} />
          </Link>
          <button onClick={onOpenAiBot} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
            <Bot size={16} color="#34d399" /> Value Device with EcoBot AI
          </button>
        </div>
      </div>

      {/* AI Bot Feature Card */}
      <div 
        onClick={onOpenAiBot}
        style={{
          background: '#111a2c',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          margin: '1.5rem 0 2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          transition: 'border-color 0.15s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e293b'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: '10px', color: '#10b981' }}>
            <Bot size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#34d399', letterSpacing: '0.05em' }}>
                AI Device Diagnosis
              </span>
              <Sparkles size={13} color="#34d399" />
            </div>
            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 600 }}>
              Sell, Upgrade, or Recycle? Discover What Your Device is Worth
            </h4>
            <p style={{ margin: '0.15rem 0 0', color: '#94a3b8', fontSize: '0.825rem' }}>
              Input your model, manufacture year & condition to receive a market valuation and CO₂ footprint savings.
            </p>
          </div>
        </div>

        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', pointerEvents: 'none', color: '#34d399', borderColor: '#10b981' }}>
          Launch Analyzer
        </button>
      </div>

      {/* Access Portals for Visitors */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
          Choose Portal
        </span>
        <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', marginTop: '0.2rem' }}>
          Select Access Level
        </h3>
      </div>

      <div className="role-grid">
        {/* Customer Portal */}
        <div className="role-btn-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#10b981' }}>
              <UserCheck size={26} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Public Access</span>
          </div>
          <div>
            <h3>Customer Portal</h3>
            <p>List e-waste devices for sale or recycling, choose your nearest collection depot, and track instant settlement payments.</p>
          </div>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
            Customer Sign In / Sign Up
          </Link>
        </div>

        {/* Collection Agent Portal */}
        <div className="role-btn-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#38bdf8' }}>
              <Truck size={26} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Field Personnel</span>
          </div>
          <div>
            <h3>Collection Agent</h3>
            <p>Access assigned doorstep pickup orders, inspect customer location details, and process collection verification on site.</p>
          </div>
          <Link to="/login?role=agent" className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', borderColor: '#1e293b' }}>
            Agent Sign In
          </Link>
        </div>

        {/* Admin Portal */}
        <div className="role-btn-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#a78bfa' }}>
              <ShieldCheck size={26} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>System Control</span>
          </div>
          <div>
            <h3>Admin Portal</h3>
            <p>Oversee registered customer accounts, manage verified agent rosters, track ledger transactions, and monitor platform metrics.</p>
          </div>
          <Link to="/login?role=admin" className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', borderColor: '#1e293b' }}>
            Admin Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
