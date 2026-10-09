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
  X
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

  const userRole = user?.role || user?.user?.role;
  const isCustomer = userRole === 'customer';
  const isAgent = userRole === 'agent';
  const isAdmin = userRole === 'admin';

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '/products';
      if (isCustomer || location.pathname === '/my-products') {
        endpoint = '/products/my-products';
      }

      const res = await API.get(endpoint);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Error loading products. ' + (err.response?.data?.message || ''));
    }
  };

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = products.filter(p =>
    (p.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.pid || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.assignedAgentDetails?.name || '').toLowerCase().includes(search.toLowerCase())
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
            <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={22} color="#10b981" />
              {isCustomer ? 'My E-Waste Submissions' : isAgent ? 'Assigned Collection Orders' : 'All Platform Products'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem' }}>
              {isCustomer 
                ? 'Track your item collection status and contact your designated collection agent.' 
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
            <Search size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>Loading products list...</p>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#0d1424', border: '1px dashed #1e293b', borderRadius: '8px' }}>
            <Package size={40} color="#64748b" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ color: '#f8fafc', fontSize: '1rem' }}>No E-Waste Items Found</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', marginTop: '0.2rem' }}>
              {isCustomer ? "You haven't listed any electronic items for collection yet." : 'No items match your search filter.'}
            </p>
            {isCustomer && (
              <Link to="/add-product" className="btn btn-primary" style={{ marginTop: '1rem', fontSize: '0.825rem' }}>
                List a Device for Collection
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredProducts.map((item) => {
              const agent = item.assignedAgentDetails;
              const customer = item.customerDetails;
              const isUpdating = updatingPid === item.pid;

              return (
                <div 
                  key={item.pid}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.1rem 1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {/* Left: Device Info */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                      ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={26} color="var(--text-dim)" />
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 600 }}>
                            {item.productName}
                          </h3>
                          <span className={`status-badge status-${(item.status || 'pending').toLowerCase()}`}>
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
                  <div style={{ borderTop: '1px solid #162033', margin: '0.85rem 0', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    
                    {/* CUSTOMER VIEW: Contact Designated Agent */}
                    {isCustomer && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                            Assigned Collection Agent
                          </span>
                          <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Truck size={14} color="#38bdf8" /> {agent?.name || 'Local Collection Agent'}
                          </div>
                          {agent?.address && (
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={12} color="#10b981" /> {agent.address}
                            </div>
                          )}
                        </div>

                        {agent?.mobile && (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <a
                              href={`tel:${agent.mobile}`}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#34d399', borderColor: '#10b981' }}
                            >
                              <Phone size={13} /> Call Agent ({agent.mobile})
                            </a>
                            <a
                              href={`https://wa.me/91${agent.mobile}?text=Hello%20${agent.name},%20inquiring%20about%20my%20e-waste%20pickup%20order%20${item.pid}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#38bdf8' }}
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AGENT & ADMIN VIEW: Customer Pickup Location & 1-Click Status Controls */}
                    {(isAgent || isAdmin) && (
                      <>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <User size={13} color="#38bdf8" /> Customer: {customer?.name || item.username}
                          </div>
                          <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.2rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                            {customer?.mobile && (
                              <a href={`tel:${customer.mobile}`} style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Phone size={11} /> {customer.mobile}
                              </a>
                            )}
                            {customer?.address && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MapPin size={11} color="#10b981" /> {customer.address}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Agent Direct 1-Click Status Controls */}
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
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
    </div>
  );
};

export default ProductList;
