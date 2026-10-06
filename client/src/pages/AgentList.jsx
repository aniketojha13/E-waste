import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Truck, ArrowLeft, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/admin/agents');
      setAgents(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch collection agents list.');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </button>
        <button onClick={fetchAgents} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="card">
        <h2 style={{ color: '#064e3b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Truck size={24} color="#059669" /> Collection Agents Table
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          List of authorized collection agents registered in the system
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading agents...</p>
        ) : agents.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No collection agents found.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Mobile Number</th>
                  <th>Email ID</th>
                  <th>Zone / Address</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 600, color: '#111827' }}>{a.name}</td>
                    <td style={{ color: '#059669', fontWeight: 500 }}>{a.username}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={14} color="#6b7280" /> {a.mobile_number || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Mail size={14} color="#6b7280" /> {a.email_id || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} color="#6b7280" /> {a.address || 'N/A'}
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

export default AgentList;
