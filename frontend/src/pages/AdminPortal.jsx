import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Shield, Users, Truck, Package, DollarSign, UserCheck } from 'lucide-react';

const AdminPortal = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, custRes, agentRes, prodRes, payRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/customers'),
        axios.get('/api/admin/agents'),
        axios.get('/api/products'),
        axios.get('/api/payments')
      ]);

      setStats(statsRes.data);
      setCustomers(custRes.data);
      setAgents(agentRes.data);
      setProducts(prodRes.data);
      setPayments(payRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/login', { username, password, role: 'admin' });
      login(res.data.token, res.data.user);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Admin login failed.');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ maxWidth: '420px', margin: '50px auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ padding: '30px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Shield size={28} color="#d97706" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#92400e', textAlign: 'center' }}>
            Administrator Login
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginBottom: '20px' }}>
            Default credentials: username: <strong>admin</strong>, password: <strong>admin123</strong>
          </p>

          {errorMsg && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Admin Username</label>
              <input className="form-input" type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Password</label>
              <input className="form-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '10px', backgroundColor: '#d97706' }}>
              Sign In as Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      <div className="card-glass" style={{ padding: '24px', marginBottom: '24px', background: '#78350f', color: 'white' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={26} color="#fcd34d" /> Admin Control Dashboard
        </h2>
        <p style={{ fontSize: '13px', color: '#fef3c7', marginTop: '4px' }}>
          Full visibility across customer accounts, collection agents, e-waste inventory, and payment transactions.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
        {['overview', 'customers', 'agents', 'products', 'payments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              fontSize: '13px',
              textTransform: 'capitalize',
              backgroundColor: activeTab === tab ? '#059669' : 'transparent',
              color: activeTab === tab ? 'white' : '#4b5563',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="card-glass" style={{ padding: '20px', textAlign: 'center' }}>
            <Users size={28} color="#059669" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '13px', color: '#6b7280' }}>Total Customers</h4>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>{stats.customerCount}</p>
          </div>
          <div className="card-glass" style={{ padding: '20px', textAlign: 'center' }}>
            <Truck size={28} color="#2563eb" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '13px', color: '#6b7280' }}>Collection Agents</h4>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>{stats.agentCount}</p>
          </div>
          <div className="card-glass" style={{ padding: '20px', textAlign: 'center' }}>
            <Package size={28} color="#7c3aed" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '13px', color: '#6b7280' }}>Total E-waste Products</h4>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>{stats.productCount}</p>
          </div>
          <div className="card-glass" style={{ padding: '20px', textAlign: 'center' }}>
            <DollarSign size={28} color="#d97706" style={{ margin: '0 auto 8px' }} />
            <h4 style={{ fontSize: '13px', color: '#6b7280' }}>Pending Pickups</h4>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#d97706' }}>{stats.pendingPayments}</p>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Registered Customers ({customers.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px' }}>Name</th>
                <th style={{ padding: '10px' }}>Username</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Mobile</th>
                <th style={{ padding: '10px' }}>Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px', fontWeight: '600' }}>{c.name}</td>
                  <td style={{ padding: '10px' }}>{c.username}</td>
                  <td style={{ padding: '10px' }}>{c.email}</td>
                  <td style={{ padding: '10px' }}>{c.mobile || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{c.address || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Collection Agents ({agents.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px' }}>Agent Name</th>
                <th style={{ padding: '10px' }}>Username</th>
                <th style={{ padding: '10px' }}>Email</th>
                <th style={{ padding: '10px' }}>Mobile</th>
                <th style={{ padding: '10px' }}>Center Address</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px', fontWeight: '600' }}>{a.name}</td>
                  <td style={{ padding: '10px' }}>{a.username}</td>
                  <td style={{ padding: '10px' }}>{a.email}</td>
                  <td style={{ padding: '10px' }}>{a.mobile || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{a.address || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>All Submitted E-waste Products ({products.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px' }}>PID</th>
                <th style={{ padding: '10px' }}>Customer</th>
                <th style={{ padding: '10px' }}>Product</th>
                <th style={{ padding: '10px' }}>Age</th>
                <th style={{ padding: '10px' }}>Price</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontWeight: '600' }}>{p.pid}</td>
                  <td style={{ padding: '10px', fontWeight: '600' }}>{p.username}</td>
                  <td style={{ padding: '10px' }}>{p.productName}</td>
                  <td style={{ padding: '10px' }}>{p.productAge}</td>
                  <td style={{ padding: '10px', fontWeight: '600', color: '#059669' }}>₹{p.productPrice}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`status-tag status-${p.status.toLowerCase()}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>System Payments & Collection Records ({payments.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px' }}>PID</th>
                <th style={{ padding: '10px' }}>Username</th>
                <th style={{ padding: '10px' }}>Product</th>
                <th style={{ padding: '10px' }}>Amount</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px', fontFamily: 'monospace', fontWeight: '600' }}>{p.pid}</td>
                  <td style={{ padding: '10px' }}>{p.username}</td>
                  <td style={{ padding: '10px' }}>{p.productName || 'N/A'}</td>
                  <td style={{ padding: '10px', fontWeight: '600', color: '#059669' }}>₹{p.amount}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`status-tag status-${p.status.toLowerCase()}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
