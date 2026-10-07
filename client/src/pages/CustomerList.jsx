import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Users, ArrowLeft, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/admin/customers');
      setCustomers(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch customers list.');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </button>
        <button onClick={fetchCustomers} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="card">
        <h2 style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
          <Users size={24} color="#38bdf8" /> Registered Customers
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          List of all registered customer recycling accounts
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>No registered customers found.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Contact Info</th>
                  <th>Pickup Address</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.username}>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{c.name}</td>
                    <td style={{ color: '#38bdf8', fontFamily: 'monospace' }}>@{c.username}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {c.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={13} color="#94a3b8" /> {c.email}
                          </div>
                        )}
                        {c.mobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                            <Phone size={13} color="#94a3b8" /> {c.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="#10b981" /> {c.address || 'Not specified'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
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

export default CustomerList;
