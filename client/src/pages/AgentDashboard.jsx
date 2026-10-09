import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  User, 
  Truck, 
  Package, 
  Phone, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  RefreshCw, 
  Search, 
  Check, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingPid, setUpdatingPid] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (pid, newStatus) => {
    setUpdatingPid(pid);
    setActionSuccess('');
    setActionError('');
    try {
      await API.put('/payments/update-status', { pid, status: newStatus });
      
      // Real-time optimistic update in local state
      setProducts(prev => prev.map(p => p.pid === pid ? { ...p, status: newStatus } : p));
      setActionSuccess(`Order ${pid} updated to "${newStatus}" in real-time.`);
      setUpdatingPid(null);

      setTimeout(() => setActionSuccess(''), 3500);
    } catch (err) {
      setUpdatingPid(null);
      setActionError(err.response?.data?.message || 'Failed to update order status.');
      setTimeout(() => setActionError(''), 4000);
    }
  };

  const pendingPickups = products.filter(p => p.status === 'Pending').length;
  const collected = products.filter(p => p.status === 'Collected').length;
  const completed = products.filter(p => p.status === 'Paid').length;

  const filteredOrders = products.filter(p => {
    const matchesSearch = 
      (p.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.pid || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.customerAddress || p.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ maxWidth: '1060px', margin: '1.5rem auto' }}>
      {/* Header Banner */}
      <div className="card title-header" style={{ padding: '2rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.65rem', 
          background: 'rgba(14, 165, 233, 0.12)', 
          borderRadius: '50%', 
          marginBottom: '0.75rem', 
          color: 'var(--secondary)' 
        }}>
          <Truck size={32} />
        </div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Collection Agent Operations</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Field Doorstep Logistics & Depot Routing. Logged in as <strong style={{ color: 'var(--text-main)' }}>{user?.name || user?.username}</strong>
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.75rem' }}>
        <div className="stat-card">
          <span className="stat-label">Pending Doorstep Visits</span>
          <h3 className="stat-value" style={{ color: '#f59e0b' }}>{pendingPickups}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Collected (In Depot)</span>
          <h3 className="stat-value" style={{ color: 'var(--secondary)' }}>{collected}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Paid & Completed</span>
          <h3 className="stat-value" style={{ color: 'var(--primary)' }}>{completed}</h3>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Assigned Orders</span>
          <h3 className="stat-value" style={{ color: 'var(--text-main)' }}>{products.length}</h3>
        </div>
      </div>

      {/* Merged Section: Assigned Orders & Update Pickup Management */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={22} color="var(--secondary)" />
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Assigned Orders & Pickup Route
              </h2>
            </div>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Unified Doorstep Dispatch: View customer location, verify device condition, and update pickup/payment status in real time.
            </p>
          </div>

          <button onClick={fetchOrders} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
            <RefreshCw size={14} /> Refresh Orders
          </button>
        </div>

        {/* Live Notification Feedback */}
        {actionSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            <CheckCircle2 size={16} />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{actionError}</span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '400px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by product, customer, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.3rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'Pending', 'Collected', 'Paid'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List / Empty State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            Loading assigned orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ margin: 0 }}>No orders found matching your search or filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredOrders.map(order => {
              const isUpdating = updatingPid === order.pid;
              const statusClass = 
                order.status === 'Paid' ? 'status-paid' :
                order.status === 'Collected' ? 'status-collected' :
                'status-pending';

              return (
                <div 
                  key={order.pid} 
                  style={{ 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius)', 
                    padding: '1.15rem 1.35rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {order.productName || 'Electronic Gadget'}
                        </h3>
                        <span className={`status-badge ${statusClass}`}>
                          {order.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                          ID: {order.pid}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.35rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <span>Category: <strong style={{ color: 'var(--text-main)' }}>{order.category || 'Electronics'}</strong></span>
                        {order.brand && <span>Brand: <strong style={{ color: 'var(--text-main)' }}>{order.brand}</strong></span>}
                        {order.model && <span>Model: <strong style={{ color: 'var(--text-main)' }}>{order.model}</strong></span>}
                        {order.condition && <span>Condition: <strong style={{ color: 'var(--text-main)' }}>{order.condition}</strong></span>}
                        {order.imeiOrSerial && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
                            <ShieldCheck size={13} /> S/N: {order.imeiOrSerial}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Agreed Payout</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        ₹{(order.productPrice || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Customer Information & Pickup Actions Grid */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)'
                  }}>
                    {/* Customer Contact */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.825rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
                        <User size={14} color="var(--text-dim)" />
                        <strong>{order.customerName || order.username || 'Customer'}</strong>
                      </div>

                      {(order.customerMobile || order.mobile) && (
                        <a 
                          href={`tel:${order.customerMobile || order.mobile}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600 }}
                        >
                          <Phone size={13} /> {order.customerMobile || order.mobile}
                        </a>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} color="var(--secondary)" />
                        <span>{order.customerAddress || order.address || 'Doorstep Pickup'}</span>
                      </div>
                    </div>

                    {/* Integrated 1-Click Update Pickup Status Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {order.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.pid, 'Collected')}
                          disabled={isUpdating}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
                        >
                          <Truck size={14} />
                          {isUpdating ? 'Updating...' : 'Mark as Collected'}
                        </button>
                      )}

                      {order.status === 'Collected' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order.pid, 'Paid')}
                          disabled={isUpdating}
                          className="btn btn-primary"
                          style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
                        >
                          <CreditCard size={14} />
                          {isUpdating ? 'Updating...' : 'Confirm Cash/UPI Payout (Paid)'}
                        </button>
                      )}

                      {/* Dropdown for custom status change */}
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.pid, e.target.value)}
                        disabled={isUpdating}
                        className="form-input"
                        style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem', width: 'auto', cursor: 'pointer' }}
                      >
                        <option value="Pending">Status: Pending</option>
                        <option value="Collected">Status: Collected</option>
                        <option value="Paid">Status: Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Merged Quick Access Navigation */}
      <div className="role-grid">
        <Link to="/agent-products" className="role-btn-card">
          <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.65rem', borderRadius: '8px', color: 'var(--secondary)', width: 'fit-content' }}>
            <Package size={26} />
          </div>
          <div>
            <h3>All Assigned Orders & Table Roster</h3>
            <p>Access the detailed full-page order database with comprehensive search, item photos, and customer logs.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AgentDashboard;
