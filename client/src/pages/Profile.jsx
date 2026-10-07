import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { User, Mail, Phone, MapPin, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await API.get('/auth/me');
        setProfileData(res.data);
        setLoading(false);
      } catch (err) {
        // Fall back to state user
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getBackPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'agent') return '/agent';
    return '/customer';
  };

  const activeUser = profileData || user;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <button onClick={() => navigate(getBackPath())} className="btn btn-outline" style={{ marginBottom: '1.25rem', padding: '0.4rem 0.85rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '84px', 
            height: '84px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)', 
            border: '2px solid rgba(16, 185, 129, 0.4)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1rem',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)'
          }}>
            <User size={40} color="#10b981" />
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '1.8rem', fontWeight: 700 }}>
            {activeUser?.name || activeUser?.username || 'User Profile'}
          </h2>
          <span className="role-badge" style={{ marginTop: '0.65rem' }}>
            {activeUser?.role}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.65rem', borderRadius: '10px' }}>
              <User size={20} color="#10b981" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Username</span>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>@{activeUser?.username}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.65rem', borderRadius: '10px' }}>
              <Mail size={20} color="#06b6d4" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>{activeUser?.email || 'N/A'}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.65rem', borderRadius: '10px' }}>
              <Phone size={20} color="#a78bfa" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Contact Number</span>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>{activeUser?.mobile || 'Not provided'}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.65rem', borderRadius: '10px' }}>
              <MapPin size={20} color="#fbbf24" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Registered Address</span>
              <p style={{ margin: 0, color: '#f8fafc', fontWeight: 600 }}>{activeUser?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
