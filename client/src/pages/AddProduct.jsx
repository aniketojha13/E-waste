import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { 
  PlusCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  Sparkles,
  Truck,
  Phone,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  HardDrive,
  RefreshCw,
  Recycle,
  Leaf
} from 'lucide-react';
import { 
  DEVICE_CATEGORIES, 
  BRAND_MODELS,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  MANUFACTURE_YEARS, 
  CONDITION_GRADES,
  verifyImeiOrSerial,
  calculateDeviceValuation
} from '../services/deviceCatalog';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const aiState = location.state || {};

  const [category, setCategory] = useState(aiState.category || 'smartphone');
  const [brand, setBrand] = useState(aiState.brand || 'Apple');
  const [model, setModel] = useState(aiState.model || '');
  const [customModel, setCustomModel] = useState('');
  const [ram, setRam] = useState(aiState.ram || '8 GB');
  const [storage, setStorage] = useState(aiState.storage || '128 GB');
  const [yearOfManufacture, setYearOfManufacture] = useState(aiState.yearOfManufacture || 2023);
  const [condition, setCondition] = useState(aiState.condition || 'good');
  const [productPrice, setProductPrice] = useState(aiState.productPrice || '');
  
  // Anti-Theft IMEI / Serial authentication
  const [imeiOrSerial, setImeiOrSerial] = useState(aiState.imeiOrSerial || '');
  const [imeiCheckResult, setImeiCheckResult] = useState(null);

  // Agents list for customer selection & location/pincode filtering
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedCategoryObj = DEVICE_CATEGORIES.find(c => c.id === category) || DEVICE_CATEGORIES[0];
  const availableBrands = selectedCategoryObj.brands || [];
  const popularModels = BRAND_MODELS[brand] || [];

  // Fetch registered collection agents
  useEffect(() => {
    API.get('/products/agents')
      .then(res => {
        setAgents(res.data || []);
        if (res.data && res.data.length > 0 && !selectedAgent) {
          setSelectedAgent(res.data[0].username);
        }
      })
      .catch(err => {
        // Agents fetch failing is non-critical — form can still be submitted
        // without pre-selecting an agent. Don't show error to user here.
        console.warn('Could not load agents list:', err?.response?.data?.message || err.message);
      });
  }, []);


  // Update default brand when category changes
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const catObj = DEVICE_CATEGORIES.find(c => c.id === newCat);
    if (catObj && catObj.brands.length > 0) {
      setBrand(catObj.brands[0]);
      setModel('');
    }
    setImeiCheckResult(null);
  };

  // Recalculate estimated price dynamically
  useEffect(() => {
    if (!aiState.productPrice) {
      const activeModel = model === 'Other' || !model ? (customModel || 'Device') : model;
      const calc = calculateDeviceValuation({
        category,
        brand,
        model: activeModel,
        yearOfManufacture,
        conditionId: condition,
        storage,
        ram
      });
      setProductPrice(calc.estimatedPrice);
    }
  }, [category, brand, model, customModel, yearOfManufacture, condition, storage, ram]);

  const handleVerifyImei = () => {
    if (!imeiOrSerial.trim()) {
      setImeiCheckResult({
        valid: false,
        message: 'Please enter the 15-digit IMEI or Serial Number to verify.'
      });
      return;
    }
    const res = verifyImeiOrSerial(imeiOrSerial, category);
    setImeiCheckResult(res);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are accepted.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToS3 = async () => {
    if (!imageFile) return null;
    try {
      const { data } = await API.post('/uploads/presign', {
        filename: imageFile.name,
        contentType: imageFile.type
      });
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': imageFile.type },
        body: imageFile
      });
      return data.imageKey;
    } catch (uploadErr) {
      console.warn('Image upload skipped:', uploadErr.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const chosenModel = model === 'Other' || !model ? (customModel || 'Standard') : model;
    const finalTitle = `${brand} ${chosenModel} (${yearOfManufacture})`;

    if (!finalTitle || !productPrice) {
      setError('Please provide device model and valuation price.');
      return;
    }

    // Anti-theft warning if mobile/tablet and IMEI not verified
    const isMobileOrTablet = category === 'smartphone' || category === 'tablet';
    if (isMobileOrTablet && (!imeiOrSerial || (imeiCheckResult && !imeiCheckResult.valid))) {
      setError('Please verify a valid 15-digit IMEI number to prevent sale of stolen/lost devices.');
      return;
    }

    setLoading(true);
    try {
      const imageKey = await uploadImageToS3();

      await API.post('/products', {
        productName: finalTitle,
        productAge: `${2025 - Number(yearOfManufacture)} Years Old (Mfg ${yearOfManufacture})`,
        productPrice: Number(productPrice),
        category,
        brand,
        model: chosenModel,
        yearOfManufacture,
        condition,
        ram,
        storage,
        specs: `${storage} Storage, ${ram} RAM`,
        imeiOrSerial: imeiOrSerial.trim(),
        isVerifiedClean: imeiCheckResult?.valid || false,
        assignedAgent: selectedAgent,
        customerNotes,
        ...(imageKey ? { imageKey } : {})
      });

      setSuccess('E-waste listed successfully! Doorstep pickup scheduled with guaranteed buyback payout.');
      setLoading(false);

      setTimeout(() => navigate('/my-products'), 1400);
    } catch (err) {
      setLoading(false);
      const status = err.response?.status;
      if (status === 403 || status === 401) {
        setError('Your session has expired or is invalid. Please log out and sign in again as a customer.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit product. Please try again.');
      }
    }
  };


  return (
    <div style={{ maxWidth: '680px', margin: '1.5rem auto' }}>
      <button onClick={() => navigate('/customer')} className="btn btn-outline" style={{ marginBottom: '1.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* 3R Circular Commitment Banner */}
      <div className="circular-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', color: '#ffffff', padding: '0.55rem', borderRadius: '50%', display: 'flex' }}>
            <Recycle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
              3R Circular Economy: REDUCE • REUSE • RECYCLE
            </div>
            <h4 style={{ margin: '0.15rem 0 0', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 700 }}>
              Guaranteed Buyback & Instant Doorstep Settlement
            </h4>
            <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              If your device works, we reuse & refurbish it; if dead, we extract rare metals safely. We buy it either way!
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        {aiState.productName && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'var(--primary-light)', 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            borderRadius: '8px', 
            padding: '0.65rem 0.85rem', 
            marginBottom: '1.25rem',
            color: 'var(--primary)',
            fontSize: '0.825rem',
            fontWeight: 600
          }}>
            <Sparkles size={15} /> Pre-filled from e-Amrit AI Diagnosis
          </div>
        )}

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          Sell Electronic Gadgets for Doorstep Collection
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Select device specifications, verify serial/IMEI security, and choose your preferred local collection agent.
        </p>

        {error && (
          <div className="alert alert-error" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            {(error.includes('session') || error.includes('log out') || error.includes('sign in again')) && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <a href="/login" onClick={() => { localStorage.removeItem('ewaste_user'); }} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem', color: 'var(--primary)' }}>
                  Log Out &amp; Sign In Again
                </a>
              </div>
            )}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Category & Brand */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Device Category *</label>
              <select 
                value={category} 
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="form-input"
              >
                {DEVICE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand / Manufacturer *</label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setModel('');
                }}
                className="form-input"
              >
                {availableBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Model & Manufacture Year */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Model Name / Series *</label>
              {popularModels.length > 0 ? (
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select popular model...</option>
                  {popularModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value="Other">Other / Not Listed</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Model number or series"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label>Year of Manufacture *</label>
              <select 
                value={yearOfManufacture} 
                onChange={(e) => setYearOfManufacture(Number(e.target.value))}
                className="form-input"
              >
                {MANUFACTURE_YEARS.map(y => (
                  <option key={y.year} value={y.year}>{y.label}</option>
                ))}
              </select>
            </div>
          </div>

          {model === 'Other' && (
            <div className="form-group">
              <label>Specify Custom Model *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Type exact model name (e.g. Galaxy M34, ThinkBook 14)"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                required
              />
            </div>
          )}

          {/* Section 3: RAM & Storage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>RAM Capacity</label>
              <select 
                value={ram} 
                onChange={(e) => setRam(e.target.value)}
                className="form-input"
              >
                {RAM_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Internal Storage</label>
              <select 
                value={storage} 
                onChange={(e) => setStorage(e.target.value)}
                className="form-input"
              >
                {STORAGE_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Hardware Condition */}
          <div className="form-group">
            <label>Working & Cosmetic Condition</label>
            <select 
              value={condition} 
              onChange={(e) => setCondition(e.target.value)}
              className="form-input"
            >
              {CONDITION_GRADES.map(g => (
                <option key={g.id} value={g.id}>{g.grade} — {g.desc}</option>
              ))}
            </select>
          </div>

          {/* Section 5: Anti-Theft IMEI / Serial Authentication */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary)' }}>
                <ShieldCheck size={16} /> Anti-Theft Security Check: {selectedCategoryObj.requiresImei ? 'IMEI (15-digit)' : 'Hardware Serial Number'} *
              </label>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>CEIR / GSMA Verification</span>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.65rem' }}>
              {selectedCategoryObj.requiresImei 
                ? 'Dial *#06# on phone keypad to view your 15-digit IMEI. Verifies device is not reported stolen.' 
                : 'Enter your device serial number (S/N) from the back panel, box, or system settings.'}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder={selectedCategoryObj.requiresImei ? 'Enter 15-digit IMEI number' : 'Enter Serial Number (e.g. C02G402...)'}
                value={imeiOrSerial}
                onChange={(e) => {
                  setImeiOrSerial(e.target.value);
                  setImeiCheckResult(null);
                }}
                required
              />
              <button
                type="button"
                onClick={handleVerifyImei}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.5rem 0.85rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                Verify Authenticity
              </button>
            </div>

            {imeiCheckResult && (
              <div style={{
                marginTop: '0.65rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.775rem',
                background: imeiCheckResult.valid ? 'var(--primary-light)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${imeiCheckResult.valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: imeiCheckResult.valid ? 'var(--primary)' : '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                {imeiCheckResult.valid ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                <span>{imeiCheckResult.message}</span>
              </div>
            )}
          </div>

          {/* Section 6: Price Valuation */}
          <div className="form-group">
            <label>Guaranteed Buyback Payout (₹) *</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 14500"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required 
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Instant cash or UPI payment is settled at your doorstep upon agent verification.
            </span>
          </div>

          {/* Section 7: Select Nearest Collection Agent with Location & Pincode Filter */}
          <div className="form-group" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--secondary)', fontSize: '0.9rem', margin: 0 }}>
                <Truck size={16} /> Doorstep Collection Agent Selection
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, background: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                Location-Matched Logistics
              </span>
            </div>
            
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: '0 0 0.85rem' }}>
              Enter your PIN code or city below to instantly display the nearest verified collection agents servicing your area:
            </p>

            {/* Pincode & City filter inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  Your Pickup PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="form-input"
                  placeholder="e.g. 110001, 560001"
                  value={customerPincode}
                  onChange={(e) => setCustomerPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ fontSize: '0.825rem', padding: '0.55rem 0.75rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  City / Locality Search
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Delhi, Sarita Vihar, North Hub"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  style={{ fontSize: '0.825rem', padding: '0.55rem 0.75rem' }}
                />
              </div>
            </div>

            {/* Agent cards filtered by location / pincode */}
            {(() => {
              const filterQuery = (customerCity || customerPincode || '').toLowerCase().trim();
              const filteredAgents = filterQuery
                ? agents.filter(ag => 
                    (ag.address || '').toLowerCase().includes(filterQuery) ||
                    (ag.name || '').toLowerCase().includes(filterQuery) ||
                    (ag.username || '').toLowerCase().includes(filterQuery)
                  )
                : agents;

              if (agents.length === 0) {
                return (
                  <select 
                    value={selectedAgent} 
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="form-input"
                  >
                    <option value="agent1">John Agent (Downtown Center - 9876543210)</option>
                    <option value="agent2">Rajesh Sharma (North Hub - 9811223344)</option>
                    <option value="agent3">Amit Patel (South Hub - 9822334455)</option>
                  </select>
                );
              }

              if (filteredAgents.length === 0) {
                return (
                  <div style={{ padding: '0.85rem', background: 'var(--bg-card)', border: '1px dashed var(--border)', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    No specific agent found for "{filterQuery}". Showing all available hubs below:
                    <div style={{ marginTop: '0.5rem' }}>
                      <button 
                        type="button" 
                        onClick={() => { setCustomerPincode(''); setCustomerCity(''); }}
                        className="btn btn-outline" 
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        Reset Filter
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredAgents.map(ag => {
                    const isSelected = selectedAgent === ag.username;
                    return (
                      <div 
                        key={ag.username}
                        onClick={() => setSelectedAgent(ag.username)}
                        style={{
                          padding: '0.75rem 0.95rem',
                          background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.875rem' }}>
                            {ag.name} <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontFamily: 'monospace' }}>@{ag.username}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                            <MapPin size={12} color="var(--primary)" /> {ag.address || 'Central Depot Center'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>
                            <Phone size={12} /> {ag.mobile || 'Contact Support'}
                          </div>
                          {isSelected && (
                            <span style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                              ✓ Selected Depot
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Section 8: Pickup Instructions & Photo */}
          <div className="form-group">
            <label>Pickup Landmark / Special Instructions (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Near metro exit 2, available in evening"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Device Photo (Optional)</label>
            <label
              htmlFor="photo-upload"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                cursor: 'pointer', border: '1px dashed var(--border)',
                borderRadius: '8px', padding: '0.75rem 1rem',
                color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-secondary)'
              }}
            >
              <Upload size={16} color="var(--primary)" />
              {imageFile ? imageFile.name : 'Upload clear photo of the device (JPEG/PNG)'}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Device Preview"
                style={{ marginTop: '0.65rem', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', width: '100%', border: '1px solid var(--border)' }}
              />
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            <PlusCircle size={16} />
            {loading ? 'Submitting Order...' : 'Confirm Guaranteed Doorstep Buyback Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
