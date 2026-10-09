import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  ShieldCheck
} from 'lucide-react';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    password: ''
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get('/auth/me');
      setProfileData(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
        mobile: res.data.mobile || '',
        address: res.data.address || '',
        password: ''
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getBackPath = () => {
    const role = user?.role || user?.user?.role;
    if (role === 'admin') return '/admin';
    if (role === 'agent') return '/agent';
    return '/customer';
  };

  const activeUser = profileData || user;

  const handleStartEdit = () => {
    setFormData({
      name: activeUser?.name || '',
      email: activeUser?.email || '',
      mobile: activeUser?.mobile || '',
      address: activeUser?.address || '',
      password: ''
    });
    setError('');
    setSuccess('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address
      };
      if (formData.password && formData.password.trim().length >= 4) {
        payload.password = formData.password.trim();
      }

      const res = await API.put('/auth/me', payload);
      setProfileData(res.data.user);

      // Also sync user in localStorage so navbar and session reflect new name immediately
      const saved = localStorage.getItem('ewaste_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const updatedStorage = {
            ...parsed,
            ...res.data.user,
            token: parsed.token
          };
          localStorage.setItem('ewaste_user', JSON.stringify(updatedStorage));
        } catch (e) {}
      }

      setSuccess('Profile updated successfully!');
      setSaving(false);
      setIsEditing(false);
    } catch (err) {
      setSaving(false);
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const roleTitle = activeUser?.role === 'admin' 
    ? 'System Administrator' 
    : activeUser?.role === 'agent' 
    ? 'Collection Agent' 
    : 'Verified Customer';

  return (
    <div style={{ maxWidth: '640px', margin: '1.5rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate(getBackPath())} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }}>
          <ArrowLeft size={15} /> Back to Dashboard
        </button>

        {!isEditing && (
          <button onClick={handleStartEdit} className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', color: 'var(--primary)', borderColor: 'var(--border)' }}>
            <Edit3 size={15} /> Edit Profile
          </button>
        )}
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ 
            width: '76px', 
            height: '76px', 
            borderRadius: '50%', 
            background: 'var(--primary-light)', 
            border: '2px solid var(--primary)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 0.75rem',
            color: 'var(--primary)'
          }}>
            <User size={36} />
          </div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: 700 }}>
            {activeUser?.name || activeUser?.username || 'User Profile'}
          </h2>
          <span className="role-badge" style={{ marginTop: '0.4rem' }}>
            {roleTitle}
          </span>
        </div>

        {/* VIEW MODE */}
        {!isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.95rem 1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--primary-light)', padding: '0.55rem', borderRadius: '8px', color: 'var(--primary)' }}>
                <User size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Username</span>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>@{activeUser?.username}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.95rem 1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(14, 165, 233, 0.12)', padding: '0.55rem', borderRadius: '8px', color: '#0ea5e9' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>{activeUser?.email || 'N/A'}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.95rem 1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(167, 139, 250, 0.12)', padding: '0.55rem', borderRadius: '8px', color: '#a78bfa' }}>
                <Phone size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Contact Phone</span>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>{activeUser?.mobile || 'Not specified'}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.95rem 1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '0.55rem', borderRadius: '8px', color: '#fbbf24' }}>
                <MapPin size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {activeUser?.role === 'agent' ? 'Assigned Collection Depot Address' : 'Doorstep Pickup Address'}
                </span>
                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: 600 }}>{activeUser?.address || 'Not specified'}</p>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              <button onClick={handleStartEdit} className="btn btn-outline" style={{ width: '100%', padding: '0.65rem' }}>
                <Edit3 size={15} /> Edit My Profile Details
              </button>
            </div>
          </div>
        ) : (
          /* EDIT MODE FORM */
          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>
                {activeUser?.role === 'agent' ? 'Collection Depot Center Location' : 'Doorstep Pickup Address'}
              </label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Street address, locality, landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>New Password (Optional — leave blank to keep current)</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter new password (min 4 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="btn btn-outline" 
                style={{ flex: 1, padding: '0.65rem' }}
                disabled={saving}
              >
                <X size={15} /> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 2, padding: '0.65rem' }}
                disabled={saving}
              >
                <Check size={15} /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
