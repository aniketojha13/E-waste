import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Truck, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AgentPortal = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'agent') {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
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
      const res = await axios.post('/api/auth/login', { username, password, role: 'agent' });
      login(res.data.token, res.data.user);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed.');
    }
  };

  const handleUpdateStatus = async (pid, newStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axios.put('/api/payments/update-status', { pid, status: newStatus });
      setSuccessMsg(`Status for item ${pid} updated to ${newStatus}`);
      fetchProducts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (!user || user.role !== 'agent') {
    return (
      <div style={{ maxWidth: '420px', margin: '50px auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ padding: '30px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Truck size={28} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#1e3a8a', textAlign: 'center' }}>
            Collection Agent Login
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginBottom: '20px' }}>
            Default credentials: username: <strong>agent1</strong>, password: <strong>agent123</strong>
          </p>

          {errorMsg && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Agent Username</label>
              <input className="form-input" type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="agent1" />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Password</label>
              <input className="form-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <button type="submit" className="btn-secondary" style={{ marginTop: '10px' }}>
              Sign In as Agent
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
      <div className="card-glass" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Truck size={24} /> Collection Agent Management
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
          View pending e-waste pickups, customer addresses, and update collection / payment statuses.
        </p>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      <div className="card-glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Scheduled E-waste Pickups ({products.length})</h3>

        {loading ? (
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '30px 0' }}>No products listed for collection yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#374151' }}>
                  <th style={{ padding: '10px' }}>PID</th>
                  <th style={{ padding: '10px' }}>Customer</th>
                  <th style={{ padding: '10px' }}>Product</th>
                  <th style={{ padding: '10px' }}>Price</th>
                  <th style={{ padding: '10px' }}>Customer Contact</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px', fontFamily: 'monospace', fontWeight: '600' }}>{p.pid}</td>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{p.customerDetails?.name || p.username}</td>
                    <td style={{ padding: '10px' }}>{p.productName} ({p.productAge})</td>
                    <td style={{ padding: '10px', fontWeight: '600', color: '#059669' }}>₹{p.productPrice}</td>
                    <td style={{ padding: '10px', fontSize: '12px' }}>
                      <div>📱 {p.customerDetails?.mobile || 'N/A'}</div>
                      <div style={{ color: '#6b7280' }}>📍 {p.customerDetails?.address || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span className={`status-tag status-${p.status.toLowerCase()}`}>{p.status}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <select
                        value={p.status}
                        onChange={(e) => handleUpdateStatus(p.pid, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px', fontWeight: '600' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Collected">Collected</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPortal;
