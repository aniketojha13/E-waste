import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  User, 
  PlusCircle, 
  PackageCheck, 
  LogOut, 
  Recycle, 
  Bot, 
  Sparkles,
  Phone,
  MapPin,
  Truck,
  ArrowRight,
  Clock
} from 'lucide-react';

const CustomerDashboard = ({ onOpenAiBot }) => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/products/my-products').catch(() => ({ data: [] })),
      API.get('/products/agents').catch(() => ({ data: [] }))
    ]).then(([prodRes, agentRes]) => {
      setProducts(prodRes.data || []);
      setAgents(agentRes.data || []);
      setLoading(false);
    });
  }, []);

  const pendingCount = products.filter(p => p.status === 'Pending').length;
  const completedCount = products.filter(p => p.status === 'Paid' || p.status === 'Collected').length;
  const totalEarned = products
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + (p.productPrice || 0), 0);

  const nearestAgent = agents[0] || {
    name: 'John Agent (Downtown Center)',
    mobile: '9876543210',
    address: 'City E-Waste Collection Hub, Sector 4'
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '1.5rem auto' }}>
      {/* Welcome Banner */}
      <div className="card title-header" style={{ padding: '2rem 1.5rem', background: '#0e1626' }}>
        <div style={{ display: 'inline-flex', padding: '0.65rem', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '50%', marginBottom: '0.75rem', color: '#10b981' }}>
          <Recycle size={32} />
        </div>
        <h1 style={{ fontSize: '1.8rem' }}>Customer Recycling Portal</h1>
        <p>
          Welcome back, <strong style={{ color: '#f8fafc' }}>{user?.name || user?.username}</strong>. Recycle electronic devices responsibly for verified doorstep cash payout.
        </p>
      </div>

      {/* Overview Metric Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Total Listed</span>
          <h3 style={{ margin: '0.2rem 0 0', color: '#f8fafc', fontSize: '1.6rem' }}>{products.length}</h3>
        </div>
        <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Pending Pickups</span>
          <h3 style={{ margin: '0.2rem 0 0', color: '#fbbf24', fontSize: '1.6rem' }}>{pendingCount}</h3>
        </div>
        <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Completed</span>
          <h3 style={{ margin: '0.2rem 0 0', color: '#38bdf8', fontSize: '1.6rem' }}>{completedCount}</h3>
        </div>
        <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Total Paid Out</span>
          <h3 style={{ margin: '0.2rem 0 0', color: '#34d399', fontSize: '1.6rem' }}>₹{totalEarned.toLocaleString()}</h3>
        </div>
      </div>

      {/* AI Bot Quick Action Banner */}
      <div 
        onClick={onOpenAiBot}
        style={{
          background: '#111a2c',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '1.1rem 1.4rem',
          marginBottom: '1.5rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#10b981' }}>
            <Bot size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 600 }}>
              Need a device valuation? Run EcoBot AI
            </h4>
            <p style={{ margin: '0.15rem 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
              Diagnose whether your device is best suited for selling, upgrading, or certified recycling.
            </p>
          </div>
        </div>
        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', color: '#34d399', borderColor: '#10b981', pointerEvents: 'none' }}>
          Open EcoBot AI
        </button>
      </div>

      {/* Nearest Collection Agent Card */}
      <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Nearest Collection Depot
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <Truck size={16} color="#38bdf8" /> {nearestAgent.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <MapPin size={13} color="#10b981" /> {nearestAgent.address}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={`tel:${nearestAgent.mobile}`}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', color: '#34d399', borderColor: '#10b981' }}
          >
            <Phone size={13} /> Call ({nearestAgent.mobile})
          </a>
          <Link
            to="/add-product"
            className="btn btn-primary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
          >
            <PlusCircle size={13} /> Schedule Pickup
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="role-grid">
        <Link to="/add-product" className="role-btn-card">
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#10b981', width: 'fit-content' }}>
            <PlusCircle size={26} />
          </div>
          <div>
            <h3>List E-Waste Product</h3>
            <p>Enter device specs or use AI valuation to schedule an agent pickup with cash payout.</p>
          </div>
        </Link>

        <Link to="/my-products" className="role-btn-card">
          <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#38bdf8', width: 'fit-content' }}>
            <PackageCheck size={26} />
          </div>
          <div>
            <h3>My Submissions & Pickups</h3>
            <p>Track live statuses (`Pending`, `Collected`, `Paid`) and contact your assigned agent.</p>
          </div>
        </Link>

        <Link to="/profile" className="role-btn-card">
          <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#a78bfa', width: 'fit-content' }}>
            <User size={26} />
          </div>
          <div>
            <h3>My Profile & Address</h3>
            <p>Verify your contact phone number and pickup address for doorstep collections.</p>
          </div>
        </Link>

        <div className="role-btn-card" onClick={logout} style={{ cursor: 'pointer', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#f87171', width: 'fit-content' }}>
            <LogOut size={26} />
          </div>
          <div>
            <h3 style={{ color: '#f87171' }}>Log Out</h3>
            <p>Safely sign out of your active customer session.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
