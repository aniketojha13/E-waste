import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { User, Mail, Phone, MapPin, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await API.get('/auth/profile');
        setProfileData(res.data);
        setLoading(false);
      } catch (err) {
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

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <button onClick={() => navigate(getBackPath())} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: '#d1fae5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1rem' 
          }}>
            <User size={40} color="#059669" />
          </div>
          <h2 style={{ color: '#064e3b' }}>{profileData?.name || user?.name || 'User Profile'}</h2>
          <span className="role-badge" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
            {profileData?.role || user?.role}
          </span>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading profile details...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <Shield size={20} color="#059669" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Username</span>
                <p style={{ fontWeight: 600, color: '#111827' }}>{profileData?.username || user?.username}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <Phone size={20} color="#059669" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Mobile Number</span>
                <p style={{ fontWeight: 500, color: '#111827' }}>{profileData?.mobile_number || 'Not provided'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <Mail size={20} color="#059669" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
                <p style={{ fontWeight: 500, color: '#111827' }}>{profileData?.email_id || 'Not provided'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <MapPin size={20} color="#059669" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Address</span>
                <p style={{ fontWeight: 500, color: '#111827' }}>{profileData?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
