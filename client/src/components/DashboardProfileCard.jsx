import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Check, 
  X, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Building
} from 'lucide-react';

const DashboardProfileCard = ({ currentUser, onProfileUpdated }) => {
  const [profile, setProfile] = useState(currentUser || {});
  const [isEditOpen, setIsEditOpen] = useState(false);
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

  // Keep local state in sync if parent currentUser updates
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  // Fetch latest profile from /api/auth/me on mount
  useEffect(() => {
    API.get('/auth/me')
      .then(res => {
        if (res.data) {
          setProfile(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const openEditModal = () => {
    setFormData({
      name: profile.name || profile.username || '',
      email: profile.email || '',
      mobile: profile.mobile || '',
      address: profile.address || '',
      password: ''
    });
    setError('');
    setSuccess('');
    setIsEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        address: formData.address.trim()
      };
      if (formData.password && formData.password.trim().length >= 4) {
        payload.password = formData.password.trim();
      }

      const res = await API.put('/auth/me', payload);
      const updatedUser = res.data.user || res.data;
      setProfile(updatedUser);

      // Synchronize localStorage for instant session update
      const stored = localStorage.getItem('ewaste_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const combined = { ...parsed, ...updatedUser, token: parsed.token };
          localStorage.setItem('ewaste_user', JSON.stringify(combined));
        } catch (err) {}
      }

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      setSuccess('Profile updated in real-time!');
      setSaving(false);
      setTimeout(() => {
        setIsEditOpen(false);
        setSuccess('');
      }, 1200);
    } catch (err) {
      setSaving(false);
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const role = profile.role || 'customer';
  const displayName = profile.name || profile.username || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const roleBadgeText = role === 'admin' 
    ? 'Administrator' 
    : role === 'agent' 
    ? 'Collection Agent' 
    : 'Recycling Customer';

  const roleIcon = role === 'admin' 
    ? <ShieldCheck size={20} color="#38bdf8" /> 
    : role === 'agent' 
    ? <Truck size={20} color="#0ea5e9" /> 
    : <User size={20} color="#10b981" />;

  const roleColor = role === 'admin' ? 'var(--secondary)' : role === 'agent' ? '#0ea5e9' : 'var(--primary)';

  return (
    <div className="card profile-dashboard-card" style={{ marginBottom: '1.5rem', padding: '1.4rem 1.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Left Side: Avatar + Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: role === 'admin' 
              ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' 
              : role === 'agent'
              ? 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)'
              : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-sm)',
            border: '2px solid var(--border)'
          }}>
            {initials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {displayName}
              </h2>
              <span className="role-badge" style={{ color: roleColor, borderColor: 'var(--border)' }}>
                {roleBadgeText}
              </span>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'var(--primary)',
                background: 'var(--primary-light)',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }}></span>
                Verified & Active
              </span>
            </div>

            <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Username: <strong style={{ color: 'var(--text-main)' }}>@{profile.username}</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Quick Edit Profile Action */}
        <div>
          <button 
            type="button" 
            onClick={openEditModal} 
            className="btn btn-outline"
            style={{ 
              padding: '0.45rem 0.95rem', 
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderColor: 'var(--border)'
            }}
          >
            <Edit3 size={14} color="var(--primary)" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Info Pills Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', 
        gap: '0.75rem', 
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.825rem', color: 'var(--text-main)' }}>
          <div style={{ color: 'var(--text-dim)' }}><Mail size={15} /></div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
            <div style={{ fontWeight: 500, wordBreak: 'break-all' }}>{profile.email || 'Not provided'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.825rem', color: 'var(--text-main)' }}>
          <div style={{ color: 'var(--text-dim)' }}><Phone size={15} /></div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Phone / Mobile</div>
            <div style={{ fontWeight: 500 }}>{profile.mobile || 'Not provided'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.825rem', color: 'var(--text-main)' }}>
          <div style={{ color: 'var(--text-dim)' }}>
            {role === 'agent' ? <Building size={15} /> : <MapPin size={15} />}
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              {role === 'agent' ? 'Assigned Collection Depot' : role === 'admin' ? 'Headquarters' : 'Pickup Address'}
            </div>
            <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
              {profile.address || (role === 'agent' ? 'Central E-Waste Depot' : 'Not provided')}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="modal-overlay" onClick={() => !saving && setIsEditOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>Edit Profile Information</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Changes apply immediately across all dashboards</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.3rem', borderRadius: '50%', border: 'none' }}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <CheckCircle2 size={15} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSave}>
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
                <label>Contact Phone / Mobile *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label>{role === 'agent' ? 'Assigned Collection Depot Hub *' : 'Doorstep Pickup Address *'}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Sector, City"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password (Optional)</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="btn btn-outline"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProfileCard;
