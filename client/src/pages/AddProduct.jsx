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
  Layers
} from 'lucide-react';
import { 
  DEVICE_CATEGORIES, 
  MANUFACTURE_YEARS, 
  CONDITION_GRADES,
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
  const [productName, setProductName] = useState(aiState.productName || '');
  const [yearOfManufacture, setYearOfManufacture] = useState(aiState.yearOfManufacture || 2023);
  const [condition, setCondition] = useState(aiState.condition || 'good');
  const [specs, setSpecs] = useState(aiState.specs || '128 GB Storage, 8 GB RAM');
  const [productPrice, setProductPrice] = useState(aiState.productPrice || '');
  
  // Agents list for customer selection
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('agent1');
  const [customerNotes, setCustomerNotes] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch registered collection agents
  useEffect(() => {
    API.get('/products/agents')
      .then(res => {
        setAgents(res.data);
        if (res.data.length > 0 && !selectedAgent) {
          setSelectedAgent(res.data[0].username);
        }
      })
      .catch(err => {
        console.warn('Could not load agents list:', err.message);
      });
  }, []);

  // Recalculate default price when model or year changes if not manually set
  useEffect(() => {
    if (!aiState.productPrice && model) {
      const calc = calculateDeviceValuation({
        category,
        brand,
        model,
        yearOfManufacture,
        conditionId: condition
      });
      setProductPrice(calc.estimatedPrice);
    }
  }, [category, brand, model, yearOfManufacture, condition]);

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

    const finalTitle = productName || `${brand} ${model || 'Device'} (${yearOfManufacture})`;

    if (!finalTitle || !productPrice) {
      setError('Please provide the device name/model and valuation price.');
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
        model: model || finalTitle,
        yearOfManufacture,
        condition,
        specs,
        assignedAgent: selectedAgent,
        customerNotes,
        ...(imageKey ? { imageKey } : {})
      });

      setSuccess('E-waste product listed! Assigned collection agent has been notified.');
      setLoading(false);

      setTimeout(() => navigate('/my-products'), 1400);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to submit product. Please verify fields.');
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <button onClick={() => navigate('/customer')} className="btn btn-outline" style={{ marginBottom: '1.25rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div className="card">
        {aiState.productName && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid rgba(16, 185, 129, 0.25)', 
            borderRadius: '8px', 
            padding: '0.65rem 0.85rem', 
            marginBottom: '1.25rem',
            color: '#34d399',
            fontSize: '0.825rem',
            fontWeight: 600
          }}>
            <Sparkles size={15} /> Pre-filled from EcoBot AI Diagnosis
          </div>
        )}

        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
          List E-Waste for Doorstep Collection
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Provide hardware details, select your nearest collection agent, and confirm payout.
        </p>

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

        <form onSubmit={handleSubmit}>
          {/* Section 1: Device Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Device Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                {DEVICE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand / Manufacturer</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Apple, Dell, Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Model Name / Series *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. iPhone 13 Pro, XPS 15"
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setProductName(`${brand} ${e.target.value} (${yearOfManufacture})`);
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Year of Manufacture</label>
              <select 
                value={yearOfManufacture} 
                onChange={(e) => {
                  setYearOfManufacture(e.target.value);
                  setProductName(`${brand} ${model || 'Device'} (${e.target.value})`);
                }}
                className="form-input"
              >
                {MANUFACTURE_YEARS.map(y => (
                  <option key={y.year} value={y.year}>{y.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Hardware Condition</label>
              <select 
                value={condition} 
                onChange={(e) => setCondition(e.target.value)}
                className="form-input"
              >
                {CONDITION_GRADES.map(g => (
                  <option key={g.id} value={g.id}>{g.grade}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Storage / RAM Specs</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 128GB Storage, 8GB RAM"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
              />
            </div>
          </div>

          {/* Price valuation */}
          <div className="form-group">
            <label>Estimated Payout Value (₹) *</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 12500"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required 
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
              Instant payment is processed to your UPI / Cash upon doorstep collection.
            </span>
          </div>

          {/* Section 2: Choose Nearest Collection Agent */}
          <div className="form-group" style={{ background: '#0d1424', border: '1px solid #1e293b', borderRadius: '8px', padding: '1rem', marginTop: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#38bdf8', fontSize: '0.85rem' }}>
              <Truck size={15} /> Select Nearest Collection Agent (Required)
            </label>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.15rem 0 0.75rem' }}>
              Choose your preferred depot agent for pickup coordination & verification:
            </p>

            {agents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {agents.map(ag => {
                  const isSelected = selectedAgent === ag.username;
                  return (
                    <div 
                      key={ag.username}
                      onClick={() => setSelectedAgent(ag.username)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: isSelected ? 'rgba(14, 165, 233, 0.12)' : 'var(--bg-secondary)',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid var(--border)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: isSelected ? '#38bdf8' : '#f8fafc', fontSize: '0.85rem' }}>
                          {ag.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                          <MapPin size={12} color="#10b981" /> {ag.address}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={12} color="#34d399" /> {ag.mobile}
                        </div>
                        {isSelected && <span style={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700 }}>Selected</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <select 
                value={selectedAgent} 
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="form-input"
              >
                <option value="agent1">John Agent (Downtown Center - 9876543210)</option>
                <option value="agent2">Rajesh Sharma (North Hub - 9811223344)</option>
                <option value="agent3">Amit Patel (South Hub - 9822334455)</option>
              </select>
            )}
          </div>

          {/* Section 3: Pickup Instructions & Photo */}
          <div className="form-group">
            <label>Pickup Landmark / Instructions (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Near metro station, available after 4:00 PM"
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
                cursor: 'pointer', border: '1px dashed #334155',
                borderRadius: '8px', padding: '0.75rem 1rem',
                color: '#94a3b8', fontSize: '0.85rem', background: 'var(--bg-secondary)'
              }}
            >
              <Upload size={16} color="#10b981" />
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
            {loading ? 'Submitting Item...' : 'Confirm Doorstep Collection Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
