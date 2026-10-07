import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Package, ArrowLeft, RefreshCw, Search } from 'lucide-react';

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const isCustomer = user?.role === 'customer';
  const isAgent = user?.role === 'agent';
  const isAdmin = user?.role === 'admin';

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
      setError('Error loading products list. ' + (err.response?.data?.message || ''));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  const filteredProducts = products.filter(p =>
    (p.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.pid || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.username || '').toLowerCase().includes(search.toLowerCase())
  );

  const getBackPath = () => {
    if (isAdmin) return '/admin';
    if (isAgent) return '/agent';
    return '/customer';
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(getBackPath())} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <button onClick={fetchProducts} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.6rem' }}>
              <Package size={24} color="#10b981" /> Product List
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              {isCustomer ? 'Products submitted under your account' : 'All submitted e-waste products in system'}
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search product, PID, user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
            <Package size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ color: '#f8fafc', fontSize: '1.1rem' }}>No products found</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {isCustomer ? "You haven't submitted any e-waste items yet." : 'No items match your search criteria.'}
            </p>
            {isCustomer && (
              <button onClick={() => navigate('/add-product')} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                Add New Product
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Product ID (PID)</th>
                  <th>Customer</th>
                  <th>Product Name</th>
                  <th>Age</th>
                  <th>Estimated Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item.pid}>
                    <td>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                        />
                      ) : (
                        <div style={{
                          width: '56px', height: '56px', borderRadius: '8px',
                          background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Package size={22} color="#64748b" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: '#34d399', fontFamily: 'monospace' }}>{item.pid}</td>
                    <td style={{ color: '#cbd5e1' }}>{item.username}</td>
                    <td style={{ fontWeight: 600, color: '#f8fafc' }}>{item.productName}</td>
                    <td style={{ color: '#94a3b8' }}>{item.productAge}</td>
                    <td style={{ color: '#38bdf8', fontWeight: 600 }}>₹{item.productPrice}</td>
                    <td>
                      <span className={`status-badge status-${(item.status || 'pending').toLowerCase()}`}>
                        {item.status || 'Pending'}
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

export default ProductList;
