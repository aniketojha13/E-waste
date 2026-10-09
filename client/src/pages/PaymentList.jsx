import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, ArrowLeft, RefreshCw, Edit, CheckCircle2, AlertCircle } from 'lucide-react';

const PaymentList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update Status Form State
  const [selectedPid, setSelectedPid] = useState('');
  const [newStatus, setNewStatus] = useState('Collected');
  const [updating, setUpdating] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/payments');
      setPayments(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Error fetching payments list.');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedPid || !newStatus) return;

    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      const res = await API.put('/payments/update-status', {
        pid: selectedPid,
        status: newStatus
      });
      setSuccess(`Status updated successfully for ${selectedPid} to ${newStatus}`);
      setUpdating(false);
      setSelectedPid('');
      fetchPayments();
    } catch (err) {
      setUpdating(false);
      setError(err.response?.data?.message || 'Failed to update payment status.');
    }
  };

  const role = user?.role || user?.user?.role;
  const isAgentOrAdmin = role === 'agent' || role === 'admin';

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(role === 'admin' ? '/admin' : '/agent')} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <button onClick={fetchPayments} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {isAgentOrAdmin && (
        <div className="card" style={{ marginBottom: '1.75rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h3 style={{ color: '#34d399', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.25rem' }}>
            <Edit size={20} color="#10b981" /> Update Payment & Doorstep Pickup Status
          </h3>

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdateStatus} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Product ID (PID)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Select or enter PID"
                value={selectedPid}
                onChange={(e) => setSelectedPid(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-input"
              >
                <option value="Pending">Pending</option>
                <option value="Collected">Collected</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', fontSize: '1.6rem' }}>
          <CreditCard size={24} color="#10b981" /> Payment & Settlement Records
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>Loading payment records...</p>
        ) : payments.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>No payment records found.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product ID (PID)</th>
                  <th>Customer Username</th>
                  <th>Payment Status</th>
                  <th>Last Updated</th>
                  {isAgentOrAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.pid}>
                    <td style={{ fontWeight: 600, color: '#34d399', fontFamily: 'monospace' }}>{p.pid}</td>
                    <td style={{ color: '#cbd5e1' }}>{p.username}</td>
                    <td>
                      <span className={`status-badge status-${(p.status || 'pending').toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : 'N/A'}
                    </td>
                    {isAgentOrAdmin && (
                      <td>
                        <button 
                          onClick={() => setSelectedPid(p.pid)}
                          className="btn btn-outline" 
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                        >
                          Select PID
                        </button>
                      </td>
                    )}
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

export default PaymentList;
