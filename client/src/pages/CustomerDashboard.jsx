import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  User, 
  PlusCircle, 
  PackageCheck, 
  LogOut, 
  Recycle, 
  Bot, 
  Sparkles,
  Leaf
} from 'lucide-react';

const CustomerDashboard = ({ onOpenAiBot }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto' }}>
      <div className="card title-header">
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.85rem', 
          background: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '50%', 
          marginBottom: '1rem',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
        }}>
          <Recycle size={38} color="#10b981" />
        </div>
        <h1>CUSTOMER DASHBOARD</h1>
        <p>Welcome back, <strong style={{ color: '#f8fafc' }}>{user?.name || user?.username}</strong>. Recycle your e-waste responsibly.</p>
      </div>

      {/* AI Bot Banner on Customer Dashboard */}
      <div 
        onClick={onOpenAiBot}
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '14px',
          padding: '1.25rem 1.75rem',
          marginBottom: '2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', padding: '0.75rem', borderRadius: '12px', display: 'flex' }}>
            <Bot size={26} color="#ffffff" />
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              EcoBot AI Device Diagnosis <Sparkles size={16} color="#34d399" />
            </h4>
            <p style={{ margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              Check if you should sell or keep your device, and calculate carbon emission reduction!
            </p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', pointerEvents: 'none' }}>
          Open AI Bot
        </button>
      </div>

      <div className="role-grid">
        <Link to="/add-product" className="role-btn-card">
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#10b981' }}>
            <PlusCircle size={36} />
          </div>
          <h3>Add Product</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Submit a new e-waste item for collection & valuation</p>
        </Link>

        <Link to="/my-products" className="role-btn-card">
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#06b6d4' }}>
            <PackageCheck size={36} />
          </div>
          <h3>My Products</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Track pickup and payment status of your items</p>
        </Link>

        <Link to="/profile" className="role-btn-card">
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#a78bfa' }}>
            <User size={36} />
          </div>
          <h3>Profile</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>View and update your contact & pickup address</p>
        </Link>

        <div className="role-btn-card" onClick={logout} style={{ cursor: 'pointer', border: '1px dashed rgba(239, 68, 68, 0.4)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#f87171' }}>
            <LogOut size={36} />
          </div>
          <h3 style={{ color: '#f87171' }}>Log Out</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sign out of your customer account</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
