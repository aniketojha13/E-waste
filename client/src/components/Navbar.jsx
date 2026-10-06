import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Recycle, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'agent') return '/agent';
    return '/customer';
  };

  return (
    <header className="navbar">
      <Link to={getDashboardPath()} className="nav-brand">
        <Recycle size={28} color="#059669" />
        <span>Online E-Waste Management</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <div className="nav-user">
            <span className="role-badge">{user.role}</span>
            <span style={{ fontWeight: 600 }}>{user.name || user.username}</span>
            <Link to="/profile" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
              <UserIcon size={16} /> Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', color: '#dc2626' }}>
              <LogOut size={16} /> Log Out
            </button>
          </div>
        ) : (
          <Link to="/" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
            Home Dashboard
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
