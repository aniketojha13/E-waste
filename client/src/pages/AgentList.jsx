import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  Truck, 
  ArrowLeft, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  UserPlus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  CheckCircle2,
  Lock
} from 'lucide-react';

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  // Add form data
  const [newAgent, setNewAgent] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    address: ''
  });

  // Edit form data
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: ''
  });

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

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await API.post('/admin/agents', newAgent);
      const createdAgent = res.data.agent || { 
        ...newAgent, 
        role: 'agent', 
        createdAt: new Date().toISOString() 
      };
      // Real-time immediate update
      setAgents(prev => [createdAgent, ...prev]);
      setSuccess(`Collection agent @${newAgent.username} registered successfully!`);
      setShowAddModal(false);
      setNewAgent({ name: '', username: '', email: '', password: '', mobile: '', address: '' });
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create agent.');
    }
  };

  const handleOpenEdit = (agent) => {
    setEditingAgent(agent);
    setEditForm({
      name: agent.name || '',
      email: agent.email || '',
      mobile: agent.mobile || '',
      address: agent.address || '',
      password: ''
    });
    setError('');
    setSuccess('');
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    if (!editingAgent) return;
    setError('');
    setSuccess('');
    try {
      const res = await API.put(`/admin/users/${editingAgent.username}`, editForm);
      const updatedUser = res.data.user || { ...editingAgent, ...editForm };
      
      // Instant real-time UI update
      setAgents(prev => prev.map(a => a.username === editingAgent.username ? { ...a, ...updatedUser } : a));
      setSuccess(`Agent @${editingAgent.username} updated in real time!`);
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update agent.');
    }
  };

  const handleDeleteAgent = async (username) => {
    if (!window.confirm(`Are you sure you want to permanently remove collection agent @${username}?`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      // Instant real-time UI update
      setAgents(prev => prev.filter(a => a.username !== username));
      await API.delete(`/admin/users/${username}`);
      setSuccess(`Agent @${username} removed from the system in real time.`);
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete agent.');
      fetchAgents();
    }
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '1.5rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button onClick={fetchAgents} className="btn btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}>
            <UserPlus size={14} /> Add Collection Agent
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '1.4rem', fontWeight: 700 }}>
              <Truck size={22} color="var(--secondary)" /> Authorized Collection Agents
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Admin roster: Manage field depot agents, add new depots, update locations, or revoke agent access.
            </p>
          </div>
          <span className="role-badge">Admin Authorization Control</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>Loading collection agents...</p>
        ) : agents.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No collection agents registered.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Username</th>
                  <th>Contact Info</th>
                  <th>Assigned Depot Center</th>
                  <th style={{ textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.username}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{a.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Since {new Date(a.createdAt || Date.now()).toLocaleDateString()}</div>
                    </td>
                    <td style={{ color: 'var(--secondary)', fontFamily: 'monospace', fontWeight: 600 }}>
                      @{a.username}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem' }}>
                        {a.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
                            <Mail size={12} color="var(--text-muted)" /> {a.email}
                          </div>
                        )}
                        {a.mobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', color: 'var(--primary)' }}>
                            <Phone size={12} /> {a.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="var(--primary)" /> {a.address || 'Central E-Waste Depot'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: 'var(--secondary)' }}
                          title="Edit Agent Profile"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(a.username)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Remove Agent"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD AGENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={18} color="var(--primary)" /> Register New Collection Agent
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgent}>
              <div className="form-group">
                <label>Agent Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Verma"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="agent_hub4"
                    value={newAgent.username}
                    onChange={(e) => setNewAgent({ ...newAgent, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="agent@ewaste.com"
                    value={newAgent.email}
                    onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Temporary Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={newAgent.password}
                    onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile"
                    value={newAgent.mobile}
                    onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Depot Location / Address *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. East Metro Recycling Center, Road No. 5"
                  value={newAgent.address}
                  onChange={(e) => setNewAgent({ ...newAgent, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  <Check size={15} /> Create Agent Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT AGENT MODAL */}
      {editingAgent && (
        <div className="modal-overlay" onClick={() => setEditingAgent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={18} color="var(--secondary)" /> Edit Agent: @{editingAgent.username}
              </h3>
              <button onClick={() => setEditingAgent(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateAgent}>
              <div className="form-group">
                <label>Agent Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Mobile *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Depot Address *</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reset Password (Optional — leave blank to keep current)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password to reset"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setEditingAgent(null)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  <Check size={15} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
