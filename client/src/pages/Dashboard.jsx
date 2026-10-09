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
  ExternalLink,
  Recycle,
  RotateCcw,
  BadgeCheck
} from 'lucide-react';

const Dashboard = ({ onOpenAiBot }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirect automatically when user is logged in
  useEffect(() => {
    if (user) {
      const role = user.role || user.user?.role;
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'agent') {
        navigate('/agent', { replace: true });
      } else if (role === 'customer') {
        navigate('/customer', { replace: true });
      }
    }
  }, [user, navigate]);

  // If user is already logged in, show their active session hub instead of login cards!
  if (user) {
    const role = user.role || user.user?.role;
    const displayName = user.name || user.user?.name || user.username || user.user?.username || 'User';
    const roleTitle = role === 'admin' ? 'Administrator' : role === 'agent' ? 'Collection Agent' : 'Customer';
    const rolePath = role === 'admin' ? '/admin' : role === 'agent' ? '/agent' : '/customer';

    return (
      <div style={{ maxWidth: '780px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card">
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--primary-light)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Active Session Detected
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            You are currently logged in as <strong style={{ color: 'var(--text-main)' }}>{displayName}</strong> ({roleTitle}).
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
      <div className="card title-header" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'var(--primary-light)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.3rem 0.85rem', borderRadius: '9999px', marginBottom: '1rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Recycle size={14} /> 3R Circular Economy: REDUCE • REUSE • RECYCLE
        </div>
        <h1>Responsible E-Waste Disposal & Guaranteed Buyback</h1>
        <p>
          Prolong hardware lifecycle, prevent heavy-metal landfill contamination, and receive guaranteed instant cash payouts with doorstep collection.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            Sell or Recycle a Device <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 3R Circular Commitment Card */}
      <div className="circular-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary)', color: '#ffffff', padding: '0.75rem', borderRadius: '10px' }}>
            <BadgeCheck size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
              Our 3R Guarantee
            </span>
            <h4 style={{ margin: '0.1rem 0 0.25rem', color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 700 }}>
              We Guarantee Doorstep Buyback for Every Electronic Gadget
            </h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.825rem', lineHeight: 1.5 }}>
              Whether functional or non-functional, our authorized collection network buys it from you:
              reusable gadgets are refurbished for second life; scrap components undergo scientific metallurgy recycling.
            </p>
          </div>
        </div>
      </div>

      {/* AI Bot Feature Card */}
      <div 
        onClick={onOpenAiBot}
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          margin: '1.5rem 0 2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '10px', color: 'var(--primary)' }}>
            <Bot size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                AI Device Diagnosis
              </span>
              <Sparkles size={13} color="var(--primary)" />
            </div>
            <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 600 }}>
              Sell, Upgrade, or Recycle? Discover What Your Device is Worth
            </h4>
            <p style={{ margin: '0.15rem 0 0', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Input your model, manufacture year, RAM/storage & condition to receive a market valuation and CO₂ footprint savings.
            </p>
          </div>
        </div>

        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', pointerEvents: 'none', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
          Launch Analyzer
        </button>
      </div>

      {/* Access Portals for Visitors */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
          Choose Portal
        </span>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', marginTop: '0.2rem' }}>
          Select Access Level
        </h3>
      </div>

      <div className="role-grid">
        {/* Customer Portal */}
        <div className="role-btn-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)' }}>
              <UserCheck size={26} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Public Access</span>
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
            <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.65rem', borderRadius: '8px', color: 'var(--secondary)' }}>
              <Truck size={26} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>Field Personnel</span>
          </div>
          <div>
            <h3>Collection Agent</h3>
            <p>Access assigned doorstep pickup orders, inspect customer location details, and process collection verification on site.</p>
          </div>
          <Link to="/login?role=agent" className="btn btn-outline" style={{ marginTop: 'auto', width: '100%' }}>
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
          <Link to="/login?role=admin" className="btn btn-outline" style={{ marginTop: 'auto', width: '100%' }}>
            Admin Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
