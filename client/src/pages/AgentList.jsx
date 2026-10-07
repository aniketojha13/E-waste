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
      setError('Failed to fetch agents list.');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </button>
        <button onClick={fetchAgents} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="card">
        <h2 style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
          <Truck size={24} color="#06b6d4" /> Collection Agents Table
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Verified field personnel authorized for e-waste doorstep collection
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>Loading collection agents...</p>
        ) : agents.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>No collection agents registered.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Username</th>
                  <th>Contact Info</th>
                  <th>Assigned Center</th>
                  <th>Active Since</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.username}>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{a.name}</td>
                    <td style={{ color: '#06b6d4', fontFamily: 'monospace' }}>@{a.username}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {a.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={13} color="#94a3b8" /> {a.email}
                          </div>
                        )}
                        {a.mobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                            <Phone size={13} color="#94a3b8" /> {a.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="#06b6d4" /> {a.address || 'Central E-Waste Depot'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}
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
