import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Truck, CheckSquare, LogOut } from 'lucide-react';

const AgentDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div className="card title-header">
        <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#d1fae5', borderRadius: '50%', marginBottom: '1rem' }}>
          <Truck size={40} color="#059669" />
        </div>
        <h1>COLLECTION AGENT DASHBOARD</h1>
        <p>Welcome, Agent <strong>{user?.name || user?.username}</strong>. Manage e-waste collections & payments.</p>
      </div>

      <div className="role-grid">
        <Link to="/profile" className="role-btn-card">
          <User size={40} color="#059669" />
          <h3>Profile</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View agent profile details</p>
        </Link>

        <Link to="/agent-products" className="role-btn-card">
          <Truck size={40} color="#059669" />
          <h3>Product List</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View e-waste items assigned for collection</p>
        </Link>

        <Link to="/update-status" className="role-btn-card">
          <CheckSquare size={40} color="#059669" />
          <h3>Payment Status</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Update payment & pickup status for products</p>
        </Link>

        <div className="role-btn-card" onClick={logout} style={{ cursor: 'pointer', border: '2px dashed #fca5a5' }}>
          <LogOut size={40} color="#dc2626" />
          <h3 style={{ color: '#dc2626' }}>Log Out</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Sign out of agent portal</p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
