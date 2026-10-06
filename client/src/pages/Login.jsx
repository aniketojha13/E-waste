import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');

  const { login, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'agent') navigate('/agent');
      else navigate('/customer');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    const res = await login(username, password, role);
    if (!res.success) {
      setError(res.message);
    }
  };

  const getRoleTitle = () => {
    if (role === 'admin') return 'Admin Portal Login';
    if (role === 'agent') return 'Collection Agent Login';
    return 'Customer Login';
  };

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto' }}>
      <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem' }}>
        <ArrowLeft size={16} /> Back to Roles
      </button>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#064e3b' }}>
          {getRoleTitle()}
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Enter your credentials to proceed
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="form-input"
            >
              <option value="admin">Admin</option>
              <option value="agent">Collection Agent</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {role === 'customer' && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#4b5563' }}>
            Don't have a customer account?{' '}
            <Link to="/signup" style={{ color: '#059669', fontWeight: 600 }}>
              Sign Up Here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
