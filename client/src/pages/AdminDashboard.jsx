import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Users, 
  Truck, 
  Package, 
  CreditCard, 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  X, 
  Check, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  
  // Real-time notification banners
  const [agentSuccess, setAgentSuccess] = useState('');
  const [agentError, setAgentError] = useState('');

  // Modals for adding & editing agents
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  // Forms
  const [newAgent, setNewAgent] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    address: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: ''
  });

  const fetchStats = () => {
    API.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.warn('Could not fetch stats:', err.message));
  };

  const fetchAgents = () => {
    setLoadingAgents(true);
    API.get('/admin/agents')
      .then(res => {
        setAgents(res.data || []);
        setLoadingAgents(false);
      })
      .catch(err => {
        setLoadingAgents(false);
      });
  };

  useEffect(() => {
    fetchStats();
    fetchAgents();
  }, []);

  // Admin Create Agent (Instant Real-Time UI Update)
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setAgentError('');
    setAgentSuccess('');
    try {
      const res = await API.post('/admin/agents', newAgent);
      const created = res.data.agent || {
        ...newAgent,
        role: 'agent',
        createdAt: new Date().toISOString()
      };

      // Optimistic update
      setAgents(prev => [created, ...prev]);
      if (stats) setStats(prev => ({ ...prev, agentCount: (prev.agentCount || 0) + 1 }));
      setAgentSuccess(`Collection agent @${newAgent.username} registered in real time!`);
      setShowAddModal(false);
      setNewAgent({ name: '', username: '', email: '', password: '', mobile: '', address: '' });
      setTimeout(() => setAgentSuccess(''), 3500);
    } catch (err) {
      setAgentError(err.response?.data?.message || 'Failed to create agent.');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (agent) => {
    setEditingAgent(agent);
    setEditForm({
      name: agent.name || '',
      email: agent.email || '',
      mobile: agent.mobile || '',
      address: agent.address || '',
      password: ''
    });
    setAgentError('');
    setAgentSuccess('');
  };

  // Admin Update Agent (Instant Real-Time UI Update)
  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    if (!editingAgent) return;
    setAgentError('');
    setAgentSuccess('');
    try {
      const res = await API.put(`/admin/users/${editingAgent.username}`, editForm);
      const updatedUser = res.data.user || { ...editingAgent, ...editForm };

      // Instant optimistic state update
      setAgents(prev => prev.map(a => a.username === editingAgent.username ? { ...a, ...updatedUser } : a));
      setAgentSuccess(`Agent @${editingAgent.username} updated in real time!`);
      setEditingAgent(null);
      setTimeout(() => setAgentSuccess(''), 3500);
    } catch (err) {
      setAgentError(err.response?.data?.message || 'Failed to update agent.');
    }
  };

  // Admin Delete Agent (Instant Real-Time UI Update)
  const handleDeleteAgent = async (username) => {
    if (!window.confirm(`Are you sure you want to permanently remove collection agent @${username}?`)) {
      return;
    }
    setAgentError('');
    setAgentSuccess('');
    try {
      // Optimistic instant removal
      setAgents(prev => prev.filter(a => a.username !== username));
      if (stats) setStats(prev => ({ ...prev, agentCount: Math.max(0, (prev.agentCount || 1) - 1) }));
      setAgentSuccess(`Agent @${username} removed in real time.`);
      await API.delete(`/admin/users/${username}`);
      setTimeout(() => setAgentSuccess(''), 3500);
    } catch (err) {
      setAgentError(err.response?.data?.message || 'Failed to delete agent.');
      fetchAgents();
    }
  };

  return (
    <div style={{ maxWidth: '1060px', margin: '1.5rem auto' }}>
      {/* Header Banner */}
      <div className="card title-header" style={{ padding: '2rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.75rem', 
          background: 'rgba(2, 132, 199, 0.15)', 
          border: '1px solid rgba(2, 132, 199, 0.3)',
          borderRadius: '50%', 
          marginBottom: '0.75rem',
          color: 'var(--secondary)'
        }}>
          <ShieldCheck size={36} />
        </div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Platform Administrator Hub</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          System Governance, Logistics Roster & Field Operations. Logged in as <strong style={{ color: 'var(--text-main)' }}>{user?.name || user?.username}</strong>
        </p>
      </div>

      {/* System Stats Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <span className="stat-label">Total Customers</span>
            <h3 className="stat-value" style={{ color: 'var(--secondary)' }}>{stats.customerCount}</h3>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Agents</span>
            <h3 className="stat-value" style={{ color: 'var(--primary)' }}>{stats.agentCount}</h3>
          </div>
          <div className="stat-card">
            <span className="stat-label">Products Listed</span>
            <h3 className="stat-value" style={{ color: 'var(--text-main)' }}>{stats.productCount}</h3>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Pickups</span>
            <h3 className="stat-value" style={{ color: '#f59e0b' }}>{stats.pendingPayments}</h3>
          </div>
        </div>
      )}

      {/* Real-Time Collection Agents Management Section */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={22} color="var(--secondary)" />
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Authorized Collection Agents Roster
              </h2>
            </div>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Real-time authorization: Edit contact/depot information or revoke agent access instantly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={fetchAgents} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
              <UserPlus size={14} /> Add New Agent
            </button>
          </div>
        </div>

        {/* Live Feedback */}
        {agentSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            <CheckCircle2 size={16} />
            <span>{agentSuccess}</span>
          </div>
        )}
        {agentError && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{agentError}</span>
          </div>
        )}

        {/* Table Roster */}
        {loadingAgents ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading collection agents...
          </div>
        ) : agents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            No collection agents currently registered. Click "+ Add New Agent" above.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Username</th>
                  <th>Contact Details</th>
                  <th>Depot Location</th>
                  <th style={{ textAlign: 'right' }}>Real-Time Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((ag) => (
                  <tr key={ag.username}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{ag.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                        Registered: {new Date(ag.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ color: 'var(--secondary)', fontFamily: 'monospace', fontWeight: 600 }}>
                      @{ag.username}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem' }}>
                        {ag.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
                            <Mail size={12} color="var(--text-muted)" /> {ag.email}
                          </div>
                        )}
                        {ag.mobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', color: 'var(--primary)' }}>
                            <Phone size={12} /> {ag.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="var(--primary)" /> {ag.address || 'Central E-Waste Depot'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ag)}
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: 'var(--secondary)', borderColor: 'var(--border)' }}
                          title="Edit Agent Details"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAgent(ag.username)}
                          className="btn btn-danger"
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                          title="Remove Agent"
                        >
                          <Trash2 size={13} /> Remove
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

      {/* Role Navigation Grid */}
      <div className="role-grid">
        <Link to="/products" className="role-btn-card">
          <div style={{ background: 'rgba(2, 132, 199, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--secondary)', width: 'fit-content' }}>
            <Package size={26} />
          </div>
          <div>
            <h3>All E-Waste Products</h3>
            <p>Review customer submissions, verify device conditions, and inspect scrap records.</p>
          </div>
        </Link>

        <Link to="/payments" className="role-btn-card">
          <div style={{ background: 'var(--primary-light)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', width: 'fit-content' }}>
            <CreditCard size={26} />
          </div>
          <div>
            <h3>Payments & Pickups</h3>
            <p>Track cash and UPI settlement records across all doorstep collections.</p>
          </div>
        </Link>

        <Link to="/admin/customers" className="role-btn-card">
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.65rem', borderRadius: '8px', color: '#a78bfa', width: 'fit-content' }}>
            <Users size={26} />
          </div>
          <div>
            <h3>Registered Customers</h3>
            <p>Inspect registered households, recycling histories, and platform members.</p>
          </div>
        </Link>

        <Link to="/admin/agents" className="role-btn-card">
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.65rem', borderRadius: '8px', color: '#06b6d4', width: 'fit-content' }}>
            <Truck size={26} />
          </div>
          <div>
            <h3>Full Agents Management</h3>
            <p>Dedicated full-page roster to administer depot territories and field collectors.</p>
          </div>
        </Link>
      </div>

      {/* Modal: Add Collection Agent */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <UserPlus size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Register Collection Agent
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ border: 'none', padding: '0.3rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgent}>
              <div className="form-group">
                <label>Agent Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
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
                    placeholder="agent_username"
                    value={newAgent.username}
                    onChange={(e) => setNewAgent({ ...newAgent, username: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={newAgent.password}
                    onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="agent@ecocycle.com"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile / Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="9876543210"
                  value={newAgent.mobile}
                  onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Depot Location *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Downtown Collection Depot, Sector 4"
                  value={newAgent.address}
                  onChange={(e) => setNewAgent({ ...newAgent, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Collection Agent */}
      {editingAgent && (
        <div className="modal-overlay" onClick={() => setEditingAgent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Edit3 size={20} color="var(--secondary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Edit Agent: @{editingAgent.username}
                </h3>
              </div>
              <button onClick={() => setEditingAgent(null)} className="btn btn-outline" style={{ border: 'none', padding: '0.3rem' }}>
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
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Depot Location *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Reset Password (Optional)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Leave blank to preserve existing password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingAgent(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
