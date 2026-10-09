import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  Package, 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Phone, 
  MapPin, 
  User, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  MessageCircle,
  Truck,
  Check,
  X,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [updatingPid, setUpdatingPid] = useState(null);

  // Transfer Order Modal (Admin only)
  const [transferringProduct, setTransferringProduct] = useState(null);
  const [allAgents, setAllAgents] = useState([]);
  const [selectedNewAgent, setSelectedNewAgent] = useState('');
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  const userRole = user?.role || user?.user?.role;
  const isCustomer = userRole === 'customer';
  const isAgent = userRole === 'agent';
  const isAdmin = userRole === 'admin';

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint;
      if (isCustomer || location.pathname === '/my-products') {
        endpoint = '/products/my-products';
      } else if (isAgent || location.pathname === '/agent-products') {
        endpoint = '/products/agent-orders';
      } else {
        // Admin: full list
        endpoint = '/products';
      }

      const res = await API.get(endpoint);
      setProducts(res.data || []);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 403) {
        setError('Access denied. Your session role does not have permission to view this page.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError('Error loading products. ' + (err.response?.data?.message || 'Please try refreshing.'));
      }
    }
  };


  const fetchAgentsForTransfer = async () => {
    try {
      let res;
      try {
        res = await API.get('/admin/agents');
      } catch {
        res = await API.get('/products/agents');
      }
      setAllAgents(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedNewAgent(res.data[0].username);
      }
    } catch (err) {
      console.warn('Could not load agents list for transfer:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (isAdmin) {
      fetchAgentsForTransfer();
    }
  }, [location.pathname]);

  const handleUpdateStatus = async (pid, newStatus) => {
    setUpdatingPid(pid);
    setActionSuccess('');
    try {
      await API.put('/payments/update-status', { pid, status: newStatus });
      setActionSuccess(`Status for ${pid} updated to ${newStatus}`);
      fetchProducts();
      setUpdatingPid(null);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setUpdatingPid(null);
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleOpenTransferModal = (product) => {
    setTransferringProduct(product);
    const initialTarget = allAgents.find(a => a.username !== product.assignedAgent)?.username || allAgents[0]?.username || '';
    setSelectedNewAgent(initialTarget);
    setActionSuccess('');
    setError('');
  };

  const handleConfirmTransfer = async (e) => {
    e.preventDefault();
    if (!transferringProduct || !selectedNewAgent) return;

    setIsSubmittingTransfer(true);
    setError('');
    setActionSuccess('');

    try {
      const res = await API.put(`/products/${transferringProduct.pid}/assign-agent`, {
        newAgentUsername: selectedNewAgent
      });

      // Update state locally
      setProducts(prev => prev.map(p => 
        p.pid === transferringProduct.pid 
          ? { ...p, assignedAgent: selectedNewAgent } 
          : p
      ));

      setActionSuccess(res.data.message || `Order ${transferringProduct.pid} successfully transferred to @${selectedNewAgent}!`);
      setTransferringProduct(null);
      fetchProducts();
      setTimeout(() => setActionSuccess(''), 4500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to transfer order to agent.');
    } finally {
      setIsSubmittingTransfer(false);
    }
  };

  const filteredProducts = products.filter(p =>
    (p.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.pid || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.assignedAgentDetails?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.assignedAgent || '').toLowerCase().includes(search.toLowerCase())
  );

  const getBackPath = () => {
    if (isAdmin) return '/admin';
    if (isAgent) return '/agent';
    return '/customer';
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '1.5rem auto' }}>
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate(getBackPath())} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <button onClick={fetchProducts} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      <div className="card">
        {/* Header and Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={22} color="var(--primary)" />
              {isCustomer ? 'My E-Waste Submissions' : isAgent ? 'Assigned Collection Orders' : 'All Platform Products'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              {isCustomer 
                ? 'Track your item collection status and contact your designated collection agent.' 
                : isAdmin 
                ? 'Inspect submissions, transfer orders between agents, and track doorstep fulfillment.' 
                : 'Inspect customer contact details, schedule visits, and process payments.'}
            </p>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by PID, model, user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.2rem', padding: '0.6rem 0.85rem 0.6rem 2.2rem', fontSize: '0.85rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {actionSuccess && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{actionSuccess}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>Loading products list...</p>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-secondary)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
            <Package size={40} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ color: 'var(--text-main)', margin: '0 0 0.25rem' }}>No Submissions Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {isCustomer ? "You haven't listed any electronic devices for buyback yet." : 'No matching product records.'}
            </p>
            {isCustomer && (
              <Link to="/add-product" className="btn btn-primary">
                Sell or Recycle a Device Now
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredProducts.map((item) => {
              const customer = item.customerDetails;
              const agent = item.assignedAgentDetails;
              const isUpdating = updatingPid === item.pid;

              return (
                <div 
                  key={item.pid}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  {/* Top Bar: Title, Category, Status & Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName} 
                          style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border)' }} 
                        />
                      ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                          <Package size={28} />
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>
                            {item.productName}
                          </h3>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                            {item.category}
                          </span>
                          <span className={`status-badge ${
                            item.status === 'Paid' ? 'status-paid' : item.status === 'Collected' ? 'status-collected' : item.status === 'Cancelled' ? 'status-cancelled' : 'status-pending'
                          }`}>
                            {item.status || 'Pending'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.3rem 0', display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ color: 'var(--secondary)', fontFamily: 'monospace' }}>ID: {item.pid}</span>
                          <span>Age: {item.productAge}</span>
                          {item.specs && <span>Specs: {item.specs}</span>}
                          {item.condition && <span style={{ textTransform: 'capitalize' }}>Condition: {item.condition}</span>}
                          {item.imeiOrSerial && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary)', fontWeight: 600 }}>
                              <ShieldCheck size={13} /> S/N: {item.imeiOrSerial} (Verified Clean)
                            </span>
                          )}
                        </div>

                        {item.customerNotes && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block', border: '1px solid var(--border)' }}>
                            Note: {item.customerNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Payout Valuation */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payout Value</span>
                      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{item.productPrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Section Divider */}
                  <div style={{ borderTop: '1px solid var(--border)', margin: '0.85rem 0', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    
                    {/* CUSTOMER VIEW: Contact Designated Agent */}
                    {isCustomer && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                            Assigned Collection Agent
                          </span>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Truck size={14} color="var(--secondary)" /> {agent?.name || 'Local Collection Agent'}
                          </div>
                          {agent?.address && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={12} color="var(--primary)" /> {agent.address}
                            </div>
                          )}
                        </div>

                        {agent?.mobile && (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <a
                              href={`tel:${agent.mobile}`}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--primary)', borderColor: 'var(--border)' }}
                            >
                              <Phone size={13} /> Call Agent ({agent.mobile})
                            </a>
                            <a
                              href={`https://wa.me/91${agent.mobile}?text=Hello%20${agent.name},%20inquiring%20about%20my%20e-waste%20pickup%20order%20${item.pid}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: 'var(--secondary)', borderColor: 'var(--border)' }}
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AGENT & ADMIN VIEW: Customer Pickup Location & Controls */}
                    {(isAgent || isAdmin) && (
                      <>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <User size={13} color="var(--secondary)" /> Customer: {customer?.name || item.username}
                          </div>
                          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                            {customer?.mobile && (
                              <a href={`tel:${customer.mobile}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Phone size={11} /> {customer.mobile}
                              </a>
                            )}
                            {customer?.address && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MapPin size={11} color="var(--secondary)" /> {customer.address}
                              </span>
                            )}
                            {/* Assigned agent pill */}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--secondary)', background: 'rgba(14, 165, 233, 0.1)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                              <Truck size={11} /> Agent: @{item.assignedAgent || 'unassigned'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {/* Admin Transfer Button */}
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenTransferModal(item)}
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: 'var(--secondary)', borderColor: 'var(--border)' }}
                              title="Re-assign or transfer this customer's pickup to another agent"
                            >
                              <ArrowRightLeft size={13} /> Transfer Agent
                            </button>
                          )}

                          {item.status !== 'Collected' && item.status !== 'Paid' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(item.pid, 'Collected')}
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', color: '#38bdf8', borderColor: '#0ea5e9' }}
                            >
                              <Check size={13} /> Mark Collected
                            </button>
                          )}
                          {item.status !== 'Paid' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(item.pid, 'Paid')}
                              className="btn btn-primary"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              <CheckCircle2 size={13} /> Mark Paid & Sold
                            </button>
                          )}
                          {item.status !== 'Cancelled' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(item.pid, 'Cancelled')}
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                              title="Cancel Request"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Admin Transfer Order to Another Agent */}
      {transferringProduct && (
        <div className="modal-overlay" onClick={() => setTransferringProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowRightLeft size={20} color="var(--secondary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Transfer Pickup Task
                </h3>
              </div>
              <button onClick={() => setTransferringProduct(null)} className="btn btn-outline" style={{ border: 'none', padding: '0.3rem' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Re-assign collection order <strong style={{ color: 'var(--text-main)' }}>{transferringProduct.pid}</strong> ({transferringProduct.productName}) for customer <strong style={{ color: 'var(--text-main)' }}>@{transferringProduct.username}</strong> to a different field collection agent.
            </p>

            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem'
            }}>
              <div><strong>Currently Assigned:</strong> @{transferringProduct.assignedAgent || 'None'}</div>
              <div><strong>Device Payout:</strong> ₹{transferringProduct.productPrice?.toLocaleString()}</div>
            </div>

            <form onSubmit={handleConfirmTransfer}>
              <div className="form-group">
                <label>Select Target Collection Agent *</label>
                <select
                  className="form-input"
                  value={selectedNewAgent}
                  onChange={(e) => setSelectedNewAgent(e.target.value)}
                  required
                >
                  {allAgents.map(ag => (
                    <option key={ag.username} value={ag.username}>
                      {ag.name} (@{ag.username}) — {ag.address || ag.city || 'Central Hub'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setTransferringProduct(null)} className="btn btn-outline" disabled={isSubmittingTransfer}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmittingTransfer}>
                  {isSubmittingTransfer ? 'Transferring...' : 'Transfer Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
