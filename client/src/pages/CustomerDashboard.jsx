import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, PlusCircle, PackageCheck, LogOut, Recycle } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div className="card title-header">
        <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#d1fae5', borderRadius: '50%', marginBottom: '1rem' }}>
          <Recycle size={40} color="#059669" />
        </div>
        <h1>CUSTOMER DASHBOARD</h1>
        <p>Welcome back, <strong>{user?.name || user?.username}</strong>. Recycle your e-waste responsibly.</p>
      </div>

      <div className="role-grid">
        <Link to="/profile" className="role-btn-card">
          <User size={40} color="#059669" />
          <h3>Profile</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View your profile and pickup address</p>
        </Link>

        <Link to="/add-product" className="role-btn-card">
          <PlusCircle size={40} color="#059669" />
          <h3>Add Product</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Submit a new e-waste item for collection</p>
        </Link>

        <Link to="/my-products" className="role-btn-card">
          <PackageCheck size={40} color="#059669" />
          <h3>Product List</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>View status of your submitted e-waste items</p>
        </Link>

        <div className="role-btn-card" onClick={logout} style={{ cursor: 'pointer', border: '2px dashed #fca5a5' }}>
          <LogOut size={40} color="#dc2626" />
          <h3 style={{ color: '#dc2626' }}>Log Out</h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Sign out of your customer account</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
