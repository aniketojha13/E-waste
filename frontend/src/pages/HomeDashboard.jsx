import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Truck, Users, Recycle } from 'lucide-react';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (user) {
    if (user.role === 'customer') navigate('/customer');
    if (user.role === 'agent') navigate('/agent');
    if (user.role === 'admin') navigate('/admin');
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <div className="card-glass" style={{ padding: '36px', textAlign: 'center', marginBottom: '36px', background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', color: 'white' }}>
        <Recycle size={56} style={{ marginBottom: '16px', color: '#34d399' }} />
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Online E-Waste Management System</h1>
        <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          Sustainable, efficient recycling platform connecting customers, collection agents, and environmental administrators.
        </p>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#111827', textAlign: 'center' }}>
        Select Your Portal
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Admin Card */}
        <div className="card-glass" style={{ padding: '28px', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigate('/admin')}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={32} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>ADMIN PORTAL</h3>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            System control center for managing customers, agents, products, and payment analytics.
          </p>
          <button className="btn-primary" style={{ width: '100%', backgroundColor: '#d97706' }}>Login as Admin</button>
        </div>

        {/* Collection Agent Card */}
        <div className="card-glass" style={{ padding: '28px', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigate('/agent')}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Truck size={32} color="#2563eb" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>COLLECTION AGENT</h3>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            Manage scheduled pickup items, customer locations, and update collection & payment status.
          </p>
          <button className="btn-primary" style={{ width: '100%', backgroundColor: '#2563eb' }}>Agent Login</button>
        </div>

        {/* Customer Card */}
        <div className="card-glass" style={{ padding: '28px', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigate('/customer')}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Users size={32} color="#059669" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>CUSTOMER PORTAL</h3>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            Sign up or log in to submit old electronic waste items for responsible recycling and cash.
          </p>
          <button className="btn-primary" style={{ width: '100%' }}>Customer Login / Register</button>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
