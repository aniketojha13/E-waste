import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Send, 
  FileText,
  UserCheck
} from 'lucide-react';

const ApplyAsAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    experience: 'Beginner (0-1 years)',
    vehicleType: 'Motorcycle / Scooter',
    availability: 'Full Time',
    motivation: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.address.trim()) {
      setError('Please fill in all required contact and location fields.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/public/agent-applications', formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '580px', margin: '3rem auto', padding: '0 1rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            marginBottom: '1.25rem'
          }}>
            <CheckCircle2 size={40} />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Application Submitted Successfully!
          </h2>

          <div style={{
            margin: '1.25rem 0 1.75rem',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              <Clock size={16} /> Admin Review Process (Within 24 Hours)
            </div>
            <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Thank you for applying to join the e-Amrit field operations fleet. Our administrators review all submissions within <strong>24 business hours</strong>. Once approved, you will receive your collection agent login credentials via SMS and email.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-outline">
              <ArrowLeft size={15} /> Return to Home
            </Link>
            <Link to="/login/agent" className="btn btn-secondary">
              <Truck size={15} /> Agent Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <Link to="/" className="btn btn-outline" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}>
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <Link to="/login/agent" style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Truck size={14} /> Already an agent? Sign In
        </Link>
      </div>

      <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: 'rgba(14, 165, 233, 0.12)',
            color: 'var(--secondary)',
            marginBottom: '0.75rem'
          }}>
            <Truck size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Apply as Field Collection Agent
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '460px', margin: '0 auto' }}>
            Partner with e-Amrit to collect e-waste items from local residential and enterprise clients with transparent payouts per pickup.
          </p>
        </div>

        {/* 24-Hour Review Notice */}
        <div style={{
          padding: '0.85rem 1rem',
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.25)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          marginBottom: '1.5rem',
          color: 'var(--text-main)',
          fontSize: '0.825rem'
        }}>
          <Clock size={18} color="var(--secondary)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Note:</strong> Applications are verified by our administrative team within <strong>24 hours</strong>. Upon approval, your agent account and route access credentials will be activated.
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section: Personal Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="agent-name">Full Legal Name *</label>
              <input
                id="agent-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter your full legal name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-group">
              <label htmlFor="agent-email">Email Address *</label>
              <input
                id="agent-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="Enter active email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="agent-phone">Contact Phone / Mobile *</label>
              <input
                id="agent-phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="agent-city">Operating City / District *</label>
              <input
                id="agent-city"
                name="city"
                type="text"
                className="form-input"
                placeholder="City or operational district"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="agent-address">Complete Residential / Base Address *</label>
            <textarea
              id="agent-address"
              name="address"
              rows={2}
              className="form-input"
              placeholder="Street address, landmark, PIN code"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Section: Operational Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="agent-experience">Experience Level</label>
              <select
                id="agent-experience"
                name="experience"
                className="form-input"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="Beginner (0-1 years)">Beginner (0-1 years)</option>
                <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
                <option value="Experienced (3+ years)">Experienced (3+ years)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="agent-vehicle">Vehicle Type</label>
              <select
                id="agent-vehicle"
                name="vehicleType"
                className="form-input"
                value={formData.vehicleType}
                onChange={handleChange}
              >
                <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                <option value="Van / Light Commercial Vehicle">Van / Light Commercial Vehicle</option>
                <option value="Electric Cargo 3-Wheeler">Electric Cargo 3-Wheeler</option>
                <option value="Bicycle / On-Foot">Bicycle / On-Foot</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="agent-avail">Availability</label>
              <select
                id="agent-avail"
                name="availability"
                className="form-input"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time (Weekdays)">Part Time (Weekdays)</option>
                <option value="Weekends Only">Weekends Only</option>
                <option value="Flexible / On-Demand">Flexible / On-Demand</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="agent-motivation">Why do you want to join as a Collection Agent?</label>
            <textarea
              id="agent-motivation"
              name="motivation"
              rows={3}
              className="form-input"
              placeholder="Briefly describe your logistics background, familiarity with local collection routes, or interest in green e-waste recycling..."
              value={formData.motivation}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            disabled={loading}
          >
            <Send size={16} />
            {loading ? 'Submitting Application...' : 'Submit Agent Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyAsAgent;
