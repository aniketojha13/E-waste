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
        <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </button>
        <button onClick={fetchCustomers} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="card">
        <h2 style={{ color: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Users size={24} color="#0284c7" /> Customer Table
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          List of all registered customers in the system
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No registered customers found.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Mobile Number</th>
                  <th>Email ID</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{c.name}</td>
                    <td style={{ color: '#0284c7', fontWeight: 500 }}>{c.username}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={14} color="#6b7280" /> {c.mobile_number || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Mail size={14} color="#6b7280" /> {c.email_id || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} color="#6b7280" /> {c.address || 'N/A'}
                      </span>
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
