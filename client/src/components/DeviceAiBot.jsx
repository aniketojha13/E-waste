import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  DollarSign, 
  RotateCcw, 
  Smartphone, 
  Laptop, 
  Cpu, 
  Tablet, 
  Tv, 
  Home, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  DEVICE_CATEGORIES, 
  BRAND_MODELS, 
  MANUFACTURE_YEARS, 
  CONDITION_GRADES, 
  ACCESSORY_OPTIONS,
  calculateDeviceValuation 
} from '../services/deviceCatalog';

const CATEGORY_ICONS = {
  smartphone: Smartphone,
  laptop: Laptop,
  desktop: Cpu,
  tablet: Tablet,
  monitor_tv: Tv,
  appliance: Home
};

export const DeviceAiBotModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(DEVICE_CATEGORIES[0].id);
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState(2023);
  const [storage, setStorage] = useState('128 GB');
  const [ram, setRam] = useState('8 GB');
  const [conditionId, setConditionId] = useState('good');
  const [selectedAccessories, setSelectedAccessories] = useState(['charger']);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const currentCat = DEVICE_CATEGORIES.find(c => c.id === category) || DEVICE_CATEGORIES[0];
  const availableModels = BRAND_MODELS[brand] || [];

  const toggleAccessory = (id) => {
    if (selectedAccessories.includes(id)) {
      setSelectedAccessories(selectedAccessories.filter(a => a !== id));
    } else {
      setSelectedAccessories([...selectedAccessories, id]);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const finalModelName = model === 'Other' || !model ? (customModel || `${brand} Device`) : model;

      const valuation = calculateDeviceValuation({
        category,
        brand,
        model: finalModelName,
        yearOfManufacture,
        conditionId,
        storage,
        ram,
        selectedAccessories
      });

      setResult({
        categoryName: currentCat.name,
        brand,
        modelName: finalModelName,
        yearOfManufacture,
        conditionId,
        storage,
        ram,
        ...valuation
      });

      setIsAnalyzing(false);
      setStep(3);
    }, 700);
  };

  const handleProceedToListing = () => {
    onClose();
    if (result) {
      navigate('/add-product', {
        state: {
          category,
          brand: result.brand,
          model: result.modelName,
          productName: `${result.brand} ${result.modelName} (${result.yearOfManufacture})`,
          productAge: `${2025 - Number(result.yearOfManufacture)} Years Old (Mfg ${result.yearOfManufacture})`,
          productPrice: result.estimatedPrice,
          yearOfManufacture: result.yearOfManufacture,
          condition: result.conditionId,
          specs: `${result.storage} Storage, ${result.ram} RAM`,
          accessories: selectedAccessories
        }
      });
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: '#10b981', color: '#0b0f19', padding: '0.35rem', borderRadius: '6px', display: 'flex' }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem', fontWeight: 700 }}>
                EcoBot AI Device Diagnosis
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Accurate Valuation, Strategic Advice & Carbon Savings
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Category, Brand, Model & Specs */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Step 1 of 2</span>
              <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginTop: '0.2rem' }}>Device Identification & Specifications</h4>
            </div>

            {/* Category Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {DEVICE_CATEGORIES.map(cat => {
                const IconComponent = CATEGORY_ICONS[cat.id] || Smartphone;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      setBrand(cat.brands[0]);
                      setModel('');
                    }}
                    style={{
                      background: isSelected ? 'var(--bg-muted)' : 'var(--bg-secondary)',
                      border: isSelected ? '1px solid #10b981' : '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: isSelected ? '#34d399' : '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <IconComponent size={20} />
                    <span>{cat.name.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Brand & Model Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Brand / Manufacturer</label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel('');
                  }}
                  className="form-input"
                >
                  {currentCat.brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Model Name</label>
                {availableModels.length > 0 ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select popular model...</option>
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="Other">Other / Not Listed</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Model number or series"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                  />
                )}
              </div>
            </div>

            {model === 'Other' && (
              <div className="form-group">
                <label>Specific Model Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type exact model name (e.g. Poco F4, ThinkBook 14)"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                />
              </div>
            )}

            {/* Year of Manufacture & Storage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label>Year of Manufacture</label>
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

              <div className="form-group">
                <label>Storage Capacity</label>
                <select
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  className="form-input"
                >
                  <option value="32 GB">32 GB</option>
                  <option value="64 GB">64 GB</option>
                  <option value="128 GB">128 GB</option>
                  <option value="256 GB">256 GB</option>
                  <option value="512 GB">512 GB</option>
                  <option value="1 TB">1 TB</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              onClick={() => setStep(2)}
            >
              Next: Hardware Condition & Accessories <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Condition & Accessories */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Step 2 of 2</span>
                <h4 style={{ color: '#f8fafc', fontSize: '1rem', marginTop: '0.2rem' }}>Condition & Included Items</h4>
              </div>
              <button onClick={() => setStep(1)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                Back
              </button>
            </div>

            {/* Condition List */}
            <div className="form-group">
              <label>Working & Cosmetic Condition</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {CONDITION_GRADES.map(c => {
                  const isSelected = conditionId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setConditionId(c.id)}
                      style={{
                        padding: '0.75rem 0.85rem',
                        background: isSelected ? 'var(--bg-muted)' : 'var(--bg-secondary)',
                        border: isSelected ? '1px solid #10b981' : '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: isSelected ? '#34d399' : '#f8fafc', fontSize: '0.875rem' }}>
                          {c.grade}
                        </span>
                        {isSelected && <CheckCircle2 size={16} color="#10b981" />}
                      </div>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                        {c.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accessories Checkboxes */}
            <div className="form-group">
              <label>Accessories Available (Increases Value)</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {ACCESSORY_OPTIONS.map(acc => {
                  const isChecked = selectedAccessories.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => toggleAccessory(acc.id)}
                      className="btn btn-outline"
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.35rem 0.65rem',
                        background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)',
                        borderColor: isChecked ? '#10b981' : 'var(--border)',
                        color: isChecked ? '#34d399' : '#cbd5e1'
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '} {acc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Calculating Precision Valuation...' : 'Analyze Valuation & Environmental Impact'}
            </button>
          </div>
        )}

        {/* STEP 3: Results & Action Recommendation */}
        {step === 3 && result && (
          <div>
            {/* Strategic Advice Card */}
            <div style={{
              background: result.strategyType === 'sell' ? 'rgba(14, 165, 233, 0.12)' : result.strategyType === 'use' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${result.strategyType === 'sell' ? '#0ea5e9' : result.strategyType === 'use' ? '#10b981' : '#ef4444'}`,
              borderRadius: '10px',
              padding: '1.1rem 1.25rem',
              marginBottom: '1.25rem'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: result.strategyType === 'sell' ? '#38bdf8' : result.strategyType === 'use' ? '#34d399' : '#f87171' }}>
                AI Recommendation
              </span>
              <h4 style={{ margin: '0.2rem 0 0.4rem', color: '#f8fafc', fontSize: '1.15rem', fontWeight: 700 }}>
                {result.strategy}
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                {result.rationale}
              </p>
            </div>

            {/* Estimated Payout */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Doorstep Collection Payout</span>
                <h3 style={{ margin: '0.15rem 0 0', color: '#34d399', fontSize: '1.5rem', fontWeight: 700 }}>
                  ₹{result.minRange.toLocaleString()} – ₹{result.maxRange.toLocaleString()}
                </h3>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8' }}>
                <div>Avg: ₹{result.estimatedPrice.toLocaleString()}</div>
                <div style={{ color: '#10b981', fontWeight: 600 }}>Instant Cash / UPI</div>
              </div>
            </div>

            {/* Environmental Impact Metrics */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Carbon Footprint Reduction
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.4rem' }}>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.75rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>{result.co2Saved} kg</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CO₂e Saved</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.75rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8' }}>{result.treesEquivalent}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Trees Absorbed</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.75rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#a78bfa' }}>{result.kmAvoided} km</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Car Travel Saved</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline"
                style={{ flex: 1, padding: '0.65rem' }}
              >
                <RotateCcw size={15} /> Recalculate
              </button>
              <button
                type="button"
                onClick={handleProceedToListing}
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.65rem' }}
              >
                List Device for Pickup (₹{result.estimatedPrice}) <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AiBotLauncherButton = ({ onClick }) => {
  return (
    <button className="ai-bot-fab" onClick={onClick} title="EcoBot AI Device Diagnosis">
      <Bot size={18} />
      <span>Analyze Device</span>
    </button>
  );
};
