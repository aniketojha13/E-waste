import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Package, UserCheck, AlertCircle } from 'lucide-react';

const CustomerPortal = () => {
  const { user, login } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add product state
  const [productName, setProductName] = useState('');
  const [productAge, setProductAge] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (user && user.role === 'customer') {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get('/api/products/my-products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/login', { username, password, role: 'customer' });
      login(res.data.token, res.data.user);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/register', {
        name,
        username,
        email,
        password,
        mobile,
        address,
        role: 'customer'
      });
      login(res.data.token, res.data.user);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await axios.post('/api/products', {
        productName,
        productAge,
        productPrice: Number(productPrice)
      });
      setSuccessMsg('Product added successfully!');
      setProductName('');
      setProductAge('');
      setProductPrice('');
      fetchMyProducts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add product.');
    }
  };

  // If not logged in as customer, show Login / Register form
  if (!user || user.role !== 'customer') {
    return (
      <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#064e3b', textAlign: 'center' }}>
            Customer {isRegistering ? 'Sign Up' : 'Login'}
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginBottom: '20px' }}>
            {isRegistering ? 'Create your e-waste customer account' : 'Welcome back! Log in to submit e-waste'}
          </p>

          {errorMsg && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegistering && (
              <>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input className="form-input" type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input className="form-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Username</label>
              <input className="form-input" type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Password</label>
              <input className="form-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {isRegistering && (
              <>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Mobile Number</label>
                  <input className="form-input" type="text" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="9876543210" />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Address</label>
                  <textarea className="form-input" rows="2" value={address} onChange={e => setAddress(e.target.value)} placeholder="Delivery / Pickup Address"></textarea>
                </div>
              </>
            )}

            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#059669', fontWeight: '600', cursor: 'pointer' }}
            >
              {isRegistering ? 'Sign In' : 'Register now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Customer Dashboard
  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
      {/* Customer Header */}
      <div className="card-glass" style={{ padding: '24px', marginBottom: '24px', display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#064e3b' }}>Customer Dashboard</h2>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Manage your listed e-waste items and track pickup/payment status.</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '13px', color: '#374151' }}>
          <div><strong>Address:</strong> {user.address || 'Not specified'}</div>
          <div><strong>Mobile:</strong> {user.mobile || 'Not specified'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Add Product Form */}
        <div className="card-glass" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} color="#059669" /> Add E-waste Item
          </h3>

          {errorMsg && (
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '8px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '8px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Product Name</label>
              <input className="form-input" type="text" required value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Dell Laptop / LG Monitor" />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Product Age (Years / Months)</label>
              <input className="form-input" type="text" required value={productAge} onChange={e => setProductAge(e.target.value)} placeholder="e.g. 2 Years" />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Estimated Price (₹)</label>
              <input className="form-input" type="number" required value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="e.g. 1500" />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Submit Item</button>
          </form>
        </div>

        {/* My Products List */}
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="#059669" /> My E-waste Items ({products.length})
          </h3>

          {loadingProducts ? (
            <p style={{ fontSize: '13px', color: '#6b7280' }}>Loading items...</p>
          ) : products.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '30px 0' }}>
              No e-waste items submitted yet. Use the form to submit items for collection!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#374151' }}>
                    <th style={{ padding: '10px' }}>PID</th>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Age</th>
                    <th style={{ padding: '10px' }}>Price</th>
                    <th style={{ padding: '10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px', fontFamily: 'monospace', fontWeight: '600' }}>{p.pid}</td>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{p.productName}</td>
                      <td style={{ padding: '10px' }}>{p.productAge}</td>
                      <td style={{ padding: '10px', fontWeight: '600', color: '#059669' }}>₹{p.productPrice}</td>
                      <td style={{ padding: '10px' }}>
                        <span className={`status-tag status-${p.status.toLowerCase()}`}>
                          {p.status}
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
    </div>
  );
};

export default CustomerPortal;
