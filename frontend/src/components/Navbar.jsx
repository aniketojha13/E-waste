import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Recycle, LogOut, User as UserIcon, Shield, Truck, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#064e3b',
      color: 'white',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
        <Recycle size={30} color="#34d399" />
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>E-Waste System</h1>
          <p style={{ fontSize: '11px', color: '#a7f3d0', margin: 0 }}>Online Recycling & Collection</p>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
              {user.role === 'admin' && <Shield size={16} color="#fcd34d" />}
              {user.role === 'agent' && <Truck size={16} color="#93c5fd" />}
              {user.role === 'customer' && <ShoppingBag size={16} color="#6ee7b7" />}
              <span style={{ fontWeight: '600' }}>{user.name}</span>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>({user.role})</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/customer" style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>Customer</Link>
            <Link to="/agent" style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>Collection Agent</Link>
            <Link to="/admin" style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>Admin</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
