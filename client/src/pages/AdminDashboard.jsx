import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Users, 
  Truck, 
  Package, 
  CreditCard, 
  User, 
  LogOut, 
  ShieldCheck,
  TrendingUp,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.warn('Could not fetch stats:', err.message));
  }, []);

  return (
    <div style={{ maxWidth: '980px', margin: '2rem auto' }}>
      <div className="card title-header">
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.85rem', 
          background: 'rgba(2, 132, 199, 0.15)', 
          border: '1px solid rgba(2, 132, 199, 0.3)',
          borderRadius: '50%', 
          marginBottom: '1rem',
          boxShadow: '0 0 20px rgba(2, 132, 199, 0.25)'
        }}>
          <ShieldCheck size={38} color="#38bdf8" />
        </div>
        <h1>ADMIN DASHBOARD</h1>
        <p>System Overview & Operations Panel. Logged in as <strong style={{ color: '#f8fafc' }}>{user?.name || user?.username}</strong></p>
      </div>

      {/* System Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Total Customers</span>
            <h3 style={{ margin: '0.35rem 0 0', color: '#38bdf8', fontSize: '1.8rem' }}>{stats.customerCount}</h3>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Active Agents</span>
            <h3 style={{ margin: '0.35rem 0 0', color: '#34d399', fontSize: '1.8rem' }}>{stats.agentCount}</h3>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Products Listed</span>
            <h3 style={{ margin: '0.35rem 0 0', color: '#f8fafc', fontSize: '1.8rem' }}>{stats.productCount}</h3>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Pending Pickups</span>
            <h3 style={{ margin: '0.35rem 0 0', color: '#fbbf24', fontSize: '1.8rem' }}>{stats.pendingPayments}</h3>
          </div>
        </div>
      )}

      <div className="role-grid">
        <Link to="/products" className="role-btn-card">
          <div style={{ background: 'rgba(2, 132, 199, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#38bdf8' }}>
            <Package size={36} />
          </div>
          <h3>Product List</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>View and review all submitted e-waste products</p>
        </Link>

        <Link to="/payments" className="role-btn-card">
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#10b981' }}>
            <CreditCard size={36} />
          </div>
          <h3>Payments & Pickups</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Track settlement and doorstep collection records</p>
        </Link>

        <Link to="/admin/customers" className="role-btn-card">
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#a78bfa' }}>
            <Users size={36} />
          </div>
          <h3>Customers</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>View registered recycling customers</p>
        </Link>

        <Link to="/admin/agents" className="role-btn-card">
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#06b6d4', width: 'fit-content' }}>
            <Truck size={32} />
          </div>
          <h3>Collection Agents</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage, add, edit, or remove authorized field collection agents</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
