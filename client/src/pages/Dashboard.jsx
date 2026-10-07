import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Truck, 
  UserCheck, 
  Bot, 
  Sparkles, 
  Leaf, 
  ArrowRight,
  Zap,
  TrendingUp
} from 'lucide-react';

const Dashboard = ({ onOpenAiBot }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (user) {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'agent') navigate('/agent');
    else if (user.role === 'customer') navigate('/customer');
  }

  return (
    <div style={{ maxWidth: '1020px', margin: '1rem auto' }}>
      {/* Hero Header */}
      <div className="card title-header" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '150px',
          background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.4rem 1rem', borderRadius: '9999px', marginBottom: '1.25rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
          <Leaf size={16} /> Certified Green E-Waste Recycling Platform
        </div>
        <h1>Next-Gen E-Waste Management & Recycling</h1>
        <p>Recycle old electronics, earn instant payouts, prevent toxic landfill pollution, and track your carbon emission savings with AI.</p>
      </div>

      {/* AI BOT FEATURE BANNER */}
      <div 
        onClick={onOpenAiBot}
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          margin: '2rem 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(16, 185, 129, 0.15)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', maxWidth: '650px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', 
            padding: '1rem', 
            borderRadius: '14px', 
            display: 'flex',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Bot size={32} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34d399' }}>
                AI-Powered Device Valuation
              </span>
              <Sparkles size={14} color="#34d399" />
            </div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.3rem' }}>
              Unsure whether to sell, keep, or recycle your device?
            </h3>
            <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Let EcoBot AI analyze your gadget specs, evaluate instant market value, and compute your carbon footprint savings.
            </p>
          </div>
        </div>

        <button className="btn btn-primary" style={{ pointerEvents: 'none' }}>
          Launch EcoBot AI <ArrowRight size={18} />
        </button>
      </div>

      {/* Role Grid Portals */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: '#cbd5e1', fontSize: '1.1rem', fontWeight: 600 }}>Select Access Portal</h3>
      </div>

      <div className="role-grid">
        {/* Customer Card */}
        <div 
          className="role-btn-card"
          onClick={() => navigate('/login')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: '50%', color: '#10b981' }}>
            <UserCheck size={44} />
          </div>
          <h3>CUSTOMER PORTAL</h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Submit old electronics for pickup, get paid upon collection, and track real-time disposal status.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
            Customer Sign In / Sign Up
          </button>
        </div>

        {/* Collection Agent Card */}
        <div 
          className="role-btn-card"
          onClick={() => navigate('/login?role=agent')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '1rem', borderRadius: '50%', color: '#06b6d4' }}>
            <Truck size={44} />
          </div>
          <h3>COLLECTION AGENT</h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            View submitted e-waste requests, schedule doorstep pickups, and update collection & payment records.
          </p>
          <button className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#38bdf8' }}>
            Agent Access
          </button>
        </div>

        {/* Admin Card */}
        <div 
          className="role-btn-card"
          onClick={() => navigate('/login?role=admin')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ background: 'rgba(2, 132, 199, 0.15)', padding: '1rem', borderRadius: '50%', color: '#38bdf8' }}>
            <ShieldCheck size={44} />
          </div>
          <h3>ADMIN PORTAL</h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            System overview metrics, manage collection agents, oversee customers, track payments and audits.
          </p>
          <button className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%' }}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
