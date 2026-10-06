import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    mobile_number: '',
    email_id: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signup, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.username || !formData.password) {
      setError('Please fill in all required fields (Name, Username, Password).');
      return;
    }

    const res = await signup(formData);
    if (res.success) {
      setSuccess('Account created successfully! Redirecting to Customer Dashboard...');
      setTimeout(() => {
        navigate('/customer');
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '2rem auto' }}>
      <button onClick={() => navigate('/login?role=customer')} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem' }}>
        <ArrowLeft size={16} /> Back to Login
      </button>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#064e3b' }}>
          Customer Registration
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Create an account to list and recycle your e-waste
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              placeholder="e.g. Alice Smith"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input 
              type="text" 
              name="username"
              className="form-input" 
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Mobile Number</label>
              <input 
                type="tel" 
                name="mobile_number"
                className="form-input" 
                placeholder="10-digit mobile number"
                value={formData.mobile_number}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email ID</label>
              <input 
                type="email" 
                name="email_id"
                className="form-input" 
                placeholder="name@example.com"
                value={formData.email_id}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pickup Address</label>
            <textarea 
              name="address"
              className="form-input" 
              placeholder="Enter full address for e-waste pick-up"
              rows={3}
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            {loading ? 'Creating Account...' : 'Sign Up Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#4b5563' }}>
          Already have an account?{' '}
          <Link to="/login?role=customer" style={{ color: '#059669', fontWeight: 600 }}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
