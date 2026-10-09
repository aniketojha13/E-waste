import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Recycle, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  LogIn, 
  Bot, 
  Truck,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = ({ onOpenAiBot }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    const role = user.role || user.user?.role;
    if (role === 'admin') return '/admin';
    if (role === 'agent') return '/agent';
    return '/customer';
  };

  const currentRole = user?.role || user?.user?.role;
  const currentDisplayName = user?.name || user?.user?.name || user?.username || user?.user?.username;

  return (
    <header className="navbar">
      <Link to={getDashboardPath()} className="nav-brand">
        <div style={{ background: 'var(--primary)', color: '#ffffff', padding: '0.35rem', borderRadius: '6px', display: 'flex' }}>
          <Recycle size={20} />
        </div>
        <span>e-Amrit</span>
      </Link>

      <div className="nav-links">
        {/* Dark / Light Mode Switch */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
        </button>


        {user ? (
          <div className="nav-user-container">
            {/* User identity chip */}
            <Link to="/profile" className="nav-user-chip" title="View Profile & Account Details">
              <div 
                className="nav-user-avatar"
                style={{
                  background: currentRole === 'admin'
                    ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                    : currentRole === 'agent'
                    ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)'
                    : 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                }}
              >
                {(currentDisplayName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="nav-user-details">
                <span 
                  className="nav-role-badge"
                  style={{
                    background: currentRole === 'admin' 
                      ? 'rgba(56, 189, 248, 0.12)' 
                      : currentRole === 'agent' 
                      ? 'rgba(14, 165, 233, 0.12)' 
                      : 'var(--primary-light)',
                    color: currentRole === 'admin' 
                      ? 'var(--secondary)' 
                      : currentRole === 'agent' 
                      ? '#0ea5e9' 
                      : 'var(--primary)',
                    border: `1px solid ${currentRole === 'admin' ? 'rgba(56, 189, 248, 0.25)' : currentRole === 'agent' ? 'rgba(14, 165, 233, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`
                  }}
                >
                  {currentRole === 'admin' ? 'ADMIN' : currentRole === 'agent' ? 'COLLECTOR' : 'CUSTOMER'}
                </span>
                <span className="nav-user-name">{currentDisplayName}</span>
              </div>
            </Link>

            {/* Direct Profile Action */}
            <Link to="/profile" className="nav-btn-profile" title="Edit Profile Details">
              <UserIcon size={14} />
              <span>Profile</span>
            </Link>

            {/* Logout Action */}
            <button 
              type="button"
              onClick={handleLogout} 
              className="nav-btn-logout"
              title="Sign Out of Session"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.825rem' }}>
              <LogIn size={14} /> Customer Sign In
            </Link>

            <Link 
              to="/login/agent" 
              className="btn btn-outline" 
              style={{ 
                padding: '0.45rem 0.75rem', 
                fontSize: '0.8rem',
                color: 'var(--secondary)',
                borderColor: 'var(--border)'
              }}
              title="Collection Agent Portal Sign In"
            >
              <Truck size={14} /> Agent Login
            </Link>

            <Link 
              to="/login/admin" 
              className="btn btn-outline" 
              style={{ 
                padding: '0.45rem 0.75rem', 
                fontSize: '0.8rem',
                color: '#a78bfa',
                borderColor: 'var(--border)'
              }}
              title="System Administrator Sign In"
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
