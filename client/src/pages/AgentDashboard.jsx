import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { User, Truck, CheckSquare, LogOut, Package, Phone, CheckCircle2 } from 'lucide-react';

const AgentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products')
      .then(res => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  const pendingPickups = products.filter(p => p.status === 'Pending').length;
  const collected = products.filter(p => p.status === 'Collected').length;
  const completed = products.filter(p => p.status === 'Paid').length;

  return (
    <div style={{ maxWidth: '1000px', margin: '1.5rem auto' }}>
      <div className="card title-header" style={{ padding: '2rem 1.5rem', background: '#0e1626' }}>
        <div style={{ display: 'inline-flex', padding: '0.65rem', background: 'rgba(14, 165, 233, 0.12)', borderRadius: '50%', marginBottom: '0.75rem', color: '#38bdf8' }}>
          <Truck size={32} />
        </div>
        <h1 style={{ fontSize: '1.8rem' }}>Collection Agent Workspace</h1>
        <p>Field Doorstep Operations. Logged in as <strong style={{ color: '#f8fafc' }}>{user?.name || user?.username}</strong></p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Pending Doorstep Visits</span>
          <h3 style={{ margin: '0.2rem 0 0', color: '#fbbf24', fontSize: '1.6rem' }}>{pendingPickups}</h3>
        </div>
        <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Collected (In Depot)</span>
          <h3 style={{ margin: '0.2rem 0 0', color: '#38bdf8', fontSize: '1.6rem' }}>{collected}</h3>
        </div>
        <div style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Paid & Completed</span>
          <h3 style={{ margin: '0.2rem 0 0', color: '#34d399', fontSize: '1.6rem' }}>{completed}</h3>
        </div>
      </div>

      <div className="role-grid">
        <Link to="/agent-products" className="role-btn-card">
          <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#38bdf8', width: 'fit-content' }}>
            <Package size={26} />
          </div>
          <div>
            <h3>Assigned Orders & Pickup Route</h3>
            <p>Inspect customer addresses, phone numbers, and mark items as Collected or Paid with 1-click.</p>
          </div>
        </Link>

        <Link to="/profile" className="role-btn-card">
          <div style={{ background: 'rgba(148, 163, 184, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#cbd5e1', width: 'fit-content' }}>
            <User size={26} />
          </div>
          <div>
            <h3>Agent Profile & Depot Center</h3>
            <p>View your depot address, contact number, and authorized collection credentials.</p>
          </div>
        </Link>

        <div className="role-btn-card" onClick={logout} style={{ cursor: 'pointer', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '0.65rem', borderRadius: '8px', color: '#f87171', width: 'fit-content' }}>
            <LogOut size={26} />
          </div>
          <div>
            <h3 style={{ color: '#f87171' }}>End Session</h3>
            <p>Safely log out of your collection agent portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
