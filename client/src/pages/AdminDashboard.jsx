import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, Truck, Package, CreditCard, User, LogOut, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div className="card title-header">
        <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#e0f2fe', borderRadius: '50%', marginBottom: '1rem' }}>
          <ShieldCheck size={40} color="#0284c7" />
        </div>
        <h1>ADMIN DASHBOARD</h1>
        <p>Welcome back, <strong>{user?.name || user?.username}</strong>. Select a section to manage.</p>
      </div>

      <div className="role-grid">
        <Link to="/profile" className="role-btn-card">
          <User size={40} color="#0284c7" />
          <h3>Profile</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View administrator profile details</p>
        </Link>

        <Link to="/admin/customers" className="role-btn-card">
          <Users size={40} color="#0284c7" />
          <h3>Customers</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View and manage registered customers</p>
        </Link>

        <Link to="/admin/agents" className="role-btn-card">
          <Truck size={40} color="#0284c7" />
          <h3>Collection Agents</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View active collection agents</p>
        </Link>

        <Link to="/products" className="role-btn-card">
          <Package size={40} color="#0284c7" />
          <h3>Product List</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View all e-waste items submitted by customers</p>
        </Link>

        <Link to="/payments" className="role-btn-card">
          <CreditCard size={40} color="#0284c7" />
          <h3>Payments</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Track payment and pickup statuses</p>
        </Link>

        <div className="role-btn-card" onClick={logout} style={{ cursor: 'pointer', border: '2px dashed #fca5a5' }}>
          <LogOut size={40} color="#dc2626" />
          <h3 style={{ color: '#dc2626' }}>Log Out</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>End your active admin session</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
