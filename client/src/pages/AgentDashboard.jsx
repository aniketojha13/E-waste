import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Truck, CheckSquare, LogOut } from 'lucide-react';

const AgentDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto' }}>
      <div className="card title-header">
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.85rem', 
          background: 'rgba(6, 182, 212, 0.15)', 
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '50%', 
          marginBottom: '1rem',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)'
        }}>
          <Truck size={38} color="#06b6d4" />
        </div>
        <h1>COLLECTION AGENT DASHBOARD</h1>
        <p>Field Operations & Doorstep Pickups. Logged in as <strong style={{ color: '#f8fafc' }}>{user?.name || user?.username}</strong></p>
      </div>

      <div className="role-grid">
        <Link to="/agent-products" className="role-btn-card">
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#06b6d4' }}>
            <Truck size={36} />
          </div>
          <h3>Assigned Pickups</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>View all customer submitted e-waste items and locations</p>
        </Link>

        <Link to="/update-status" className="role-btn-card">
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#10b981' }}>
            <CheckSquare size={36} />
          </div>
          <h3>Update Status</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Mark items as Collected, Paid, or Cancelled</p>
        </Link>

        <Link to="/profile" className="role-btn-card">
          <div style={{ background: 'rgba(148, 163, 184, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#cbd5e1' }}>
            <User size={36} />
          </div>
          <h3>Profile</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>View agent ID, contact info, and center details</p>
        </Link>

        <div className="role-btn-card" onClick={logout} style={{ cursor: 'pointer', border: '1px dashed rgba(239, 68, 68, 0.4)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#f87171' }}>
            <LogOut size={36} />
          </div>
          <h3 style={{ color: '#f87171' }}>Log Out</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sign out of agent session</p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
