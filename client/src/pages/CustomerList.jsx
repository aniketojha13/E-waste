import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  Users, 
  ArrowLeft, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Search,
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Edit Modal State
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: ''
  });

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

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name || '',
      email: customer.email || '',
      mobile: customer.mobile || '',
      address: customer.address || '',
      password: ''
    });
    setError('');
    setSuccess('');
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setError('');
    setSuccess('');
    try {
      await API.put(`/admin/users/${editingCustomer.username}`, editForm);
      setSuccess(`Customer @${editingCustomer.username} updated successfully!`);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer account.');
    }
  };

  const handleDeleteCustomer = async (username) => {
    if (!window.confirm(`Are you sure you want to permanently delete customer account @${username}?`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await API.delete(`/admin/users/${username}`);
      setSuccess(`Customer @${username} removed successfully.`);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customer.');
    }
  };

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.mobile || '').includes(search)
  );

  return (
    <div style={{ maxWidth: '1060px', margin: '1.5rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button onClick={() => navigate('/admin')} className="btn btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2rem', padding: '0.45rem 0.75rem 0.45rem 2rem', fontSize: '0.825rem' }}
            />
            <Search size={13} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>
          <button onClick={fetchCustomers} className="btn btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '1.4rem', fontWeight: 700 }}>
              <Users size={22} color="var(--primary)" /> Registered Customer Accounts
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Admin management panel: Inspect verified customer details, update records, or remove accounts.
            </p>
          </div>
          <span className="role-badge">Admin Authorization Control</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>Loading customers...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No customers matching your search.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Username</th>
                  <th>Contact Info</th>
                  <th>Pickup Address</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.username}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.name}</div>
                    </td>
                    <td style={{ color: 'var(--primary)', fontFamily: 'monospace', fontWeight: 600 }}>
                      @{c.username}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem' }}>
                        {c.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
                            <Mail size={12} color="var(--text-muted)" /> {c.email}
                          </div>
                        )}
                        {c.mobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', color: 'var(--primary)' }}>
                            <Phone size={12} /> {c.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="#f59e0b" /> {c.address || 'Not specified'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-dim)' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', color: 'var(--secondary)' }}
                          title="Edit Customer Details"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.username)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Remove Customer Account"
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

      {/* EDIT CUSTOMER MODAL */}
      {editingCustomer && (
        <div className="modal-overlay" onClick={() => setEditingCustomer(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={18} color="var(--primary)" /> Edit Customer: @{editingCustomer.username}
              </h3>
              <button onClick={() => setEditingCustomer(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer}>
              <div className="form-group">
                <label>Customer Full Name *</label>
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
                  <label>Mobile Contact *</label>
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
                <label>Pickup Location Address *</label>
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
                <button type="button" onClick={() => setEditingCustomer(null)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  <Check size={15} /> Save Customer Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
