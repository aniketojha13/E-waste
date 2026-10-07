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
  Truck
} from 'lucide-react';

const Navbar = ({ onOpenAiBot }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        <div style={{ background: '#10b981', color: '#0b0f19', padding: '0.35rem', borderRadius: '6px', display: 'flex' }}>
          <Recycle size={20} />
        </div>
        <span>EcoCycle <span style={{ color: '#10b981', fontWeight: 500 }}>E-Waste</span></span>
        <span className="nav-brand-badge">Hub</span>
      </Link>

      <div className="nav-links">
        {/* EcoBot AI Trigger */}
        <button 
          type="button" 
          onClick={onOpenAiBot}
          className="btn btn-outline"
          style={{ 
            padding: '0.4rem 0.85rem', 
            fontSize: '0.8rem', 
            color: '#34d399', 
            borderColor: '#1e293b'
          }}
          title="EcoBot AI Device Diagnosis"
        >
          <Bot size={15} />
          <span>EcoBot AI</span>
        </button>

        {user ? (
          <div className="nav-user">
            <span className="role-badge">
              {user.role === 'admin' ? 'Admin' : user.role === 'agent' ? 'Collector' : 'Customer'}
            </span>
            <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>
              {user.name || user.username}
            </span>
            <Link to="/profile" className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
              <UserIcon size={14} /> Profile
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline" 
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#f87171' }}
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
              <LogIn size={14} /> Customer Sign In
            </Link>

            {/* Changed from "Staff Portal" to "Admin & Collector Login" per user instruction */}
            <Link 
              to="/login?role=agent" 
              className="btn btn-outline" 
              style={{ 
                padding: '0.45rem 0.85rem', 
                fontSize: '0.8rem',
                color: '#38bdf8',
                borderColor: '#1e293b'
              }}
              title="Admin and Collection Agent Sign In / Login"
            >
              <ShieldCheck size={14} /> Admin & Collector Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
