import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Recycle, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  LogIn, 
  Bot, 
  Sparkles,
  Truck
} from 'lucide-react';

const Navbar = ({ onOpenAiBot }) => {
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
        <div className="nav-brand-icon">
          <Recycle size={22} color="#ffffff" />
        </div>
        <span>EcoCycle <span style={{ color: '#10b981', fontWeight: 400 }}>E-Waste</span></span>
      </Link>

      <div className="nav-links">
        {/* EcoBot AI button */}
        <button 
          type="button" 
          onClick={onOpenAiBot}
          className="btn btn-outline"
          style={{ 
            padding: '0.45rem 0.9rem', 
            fontSize: '0.85rem', 
            color: '#34d399', 
            borderColor: 'rgba(16, 185, 129, 0.4)',
            background: 'rgba(16, 185, 129, 0.1)'
          }}
          title="Analyze device with AI"
        >
          <Bot size={16} />
          <span>EcoBot AI</span>
          <Sparkles size={12} color="#34d399" />
        </button>

        {user ? (
          <div className="nav-user">
            <span className="role-badge">
              {user.role === 'admin' ? '🛡️ Admin' : user.role === 'agent' ? '🚚 Agent' : '🧑‍💻 Customer'}
            </span>
            <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
              {user.name || user.username}
            </span>
            <Link to="/profile" className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
              <UserIcon size={16} /> Profile
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline" 
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.875rem' }}>
              <LogIn size={15} /> Sign In / Register
            </Link>

            {/* Corner Option for Admin and Customer Agent Login */}
            <Link 
              to="/login?role=admin" 
              className="btn btn-outline" 
              style={{ 
                padding: '0.45rem 0.85rem', 
                fontSize: '0.8rem',
                color: '#38bdf8',
                borderColor: 'rgba(6, 182, 212, 0.35)',
                background: 'rgba(6, 182, 212, 0.08)'
              }}
              title="Staff Portal (Admin & Agent Login)"
            >
              <ShieldCheck size={15} /> Staff Portal
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
