import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  User, 
  PlusCircle, 
  PackageCheck, 
  Recycle, 
  Phone, 
  MapPin, 
  Truck, 
  Clock,
  Sparkles
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
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
      <div className="card title-header" style={{ padding: '2rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.65rem', 
          background: 'var(--primary-light)', 
          borderRadius: '50%', 
          marginBottom: '0.75rem', 
          color: 'var(--primary)' 
        }}>
          <Recycle size={32} />
        </div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Customer Recycling Portal</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, <strong style={{ color: 'var(--text-main)' }}>{user?.name || user?.username}</strong>. Recycle electronic gadgets responsibly for verified doorstep cash payout.
        </p>
      </div>

      {/* Overview Metric Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <span className="stat-label">Total Listed</span>
          <h3 className="stat-value" style={{ color: 'var(--text-main)' }}>{products.length}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Pickups</span>
          <h3 className="stat-value" style={{ color: '#f59e0b' }}>{pendingCount}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <h3 className="stat-value" style={{ color: 'var(--secondary)' }}>{completedCount}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Paid Out</span>
          <h3 className="stat-value" style={{ color: 'var(--primary)' }}>₹{totalEarned.toLocaleString()}</h3>
        </div>
      </div>

      {/* Nearest Collection Agent Card */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Nearest Authorized Collection Depot
          </span>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem' }}>
            <Truck size={17} color="var(--secondary)" /> {nearestAgent.name}
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
            <MapPin size={14} color="var(--primary)" /> {nearestAgent.address}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <a
            href={`tel:${nearestAgent.mobile}`}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', color: 'var(--primary)', borderColor: 'var(--border)' }}
          >
            <Phone size={13} /> Call ({nearestAgent.mobile})
          </a>
          <Link
            to="/add-product"
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
          >
            <PlusCircle size={14} /> Schedule Pickup
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="role-grid">
        <Link to="/add-product" className="role-btn-card">
          <div style={{ background: 'var(--primary-light)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', width: 'fit-content' }}>
            <PlusCircle size={26} />
          </div>
          <div>
            <h3>List E-Waste Product</h3>
            <p>Enter device specs or model to schedule doorstep agent pickup with verified cash payout.</p>
          </div>
        </Link>

        <Link to="/my-products" className="role-btn-card">
          <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.65rem', borderRadius: '8px', color: 'var(--secondary)', width: 'fit-content' }}>
            <PackageCheck size={26} />
          </div>
          <div>
            <h3>My Submissions & Pickups</h3>
            <p>Track live statuses (`Pending`, `Collected`, `Paid`) and contact your assigned agent.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
