import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Truck, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (user) {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'agent') navigate('/agent');
    else if (user.role === 'customer') navigate('/customer');
  }

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto' }}>
      <div className="card title-header">
        <h1>Online E-Waste Management System</h1>
        <p>Select your portal role to access the management panel</p>
      </div>

      <div className="role-grid">
        <div 
          className="role-btn-card"
          onClick={() => navigate('/login?role=admin')}
          style={{ cursor: 'pointer' }}
        >
          <ShieldCheck size={56} color="#0284c7" />
          <h3>ADMIN</h3>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            System overview, manage agents, customers, products & payments
          </p>
          <button className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%' }}>
            Admin Login
          </button>
        </div>

        <div 
          className="role-btn-card"
          onClick={() => navigate('/login?role=agent')}
          style={{ cursor: 'pointer' }}
        >
          <Truck size={56} color="#059669" />
          <h3>COLLECTION AGENT</h3>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            View assigned e-waste pick-ups and update payment/pickup status
          </p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
            Agent Login
          </button>
        </div>

        <div 
          className="role-btn-card"
          onClick={() => navigate('/login?role=customer')}
          style={{ cursor: 'pointer' }}
        >
          <UserCheck size={56} color="#10b981" />
          <h3>CUSTOMER</h3>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Submit e-waste products, track pick-ups & manage profile
          </p>
          <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
            Customer Login / Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
