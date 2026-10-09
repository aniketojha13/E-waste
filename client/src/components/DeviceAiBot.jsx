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
  Watch,
  Gamepad2,
  ShieldCheck,
  ShieldAlert,
  Info,
  Calendar,
  Layers,
  Recycle
} from 'lucide-react';
import { 
  DEVICE_CATEGORIES, 
  BRAND_MODELS, 
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  MANUFACTURE_YEARS, 
  CONDITION_GRADES, 
  ACCESSORY_OPTIONS,
  verifyImeiOrSerial,
  calculateDeviceValuation 
} from '../services/deviceCatalog';

const CATEGORY_ICONS = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Cpu,
  smartwatch: Watch,
  gaming_audio: Gamepad2,
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

  // Anti-Theft IMEI / Serial check
  const [imeiOrSerial, setImeiOrSerial] = useState('');
  const [imeiResult, setImeiResult] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const currentCat = DEVICE_CATEGORIES.find(c => c.id === category) || DEVICE_CATEGORIES[0];
  const availableBrands = currentCat.brands || [];
  const availableModels = BRAND_MODELS[brand] || [];

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    const cat = DEVICE_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.brands.length > 0) {
      setBrand(cat.brands[0]);
      setModel('');
    }
    setImeiResult(null);
  };

  const toggleAccessory = (id) => {
    if (selectedAccessories.includes(id)) {
      setSelectedAccessories(selectedAccessories.filter(a => a !== id));
    } else {
      setSelectedAccessories([...selectedAccessories, id]);
    }
  };

  const handleVerifyImei = () => {
    if (!imeiOrSerial.trim()) {
      setImeiResult({ valid: false, message: 'Please enter an IMEI or Serial Number.' });
      return;
    }
    const res = verifyImeiOrSerial(imeiOrSerial, category);
    setImeiResult(res);
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
        imeiOrSerial: imeiOrSerial.trim(),
        isVerifiedClean: imeiResult?.valid || false,
        ...valuation
      });

      setIsAnalyzing(false);
      setStep(3);
    }, 600);
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
          ram: result.ram,
          storage: result.storage,
          specs: `${result.storage} Storage, ${result.ram} RAM`,
          imeiOrSerial: result.imeiOrSerial,
          isVerifiedClean: result.isVerifiedClean,
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
            <div style={{ background: 'var(--primary)', color: '#ffffff', padding: '0.35rem', borderRadius: '6px', display: 'flex' }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 700 }}>
                EcoBot AI Device Diagnosis & 3R Advisor
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Hardware Valuation • Anti-Theft Security • 3R (Reduce, Reuse, Recycle) Buyback
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Category, Brand, Model & Specs */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Step 1 of 2</span>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginTop: '0.15rem' }}>Select Device & Hardware Specs</h4>
            </div>

            {/* Category Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {DEVICE_CATEGORIES.map(cat => {
                const IconComponent = CATEGORY_ICONS[cat.id] || Smartphone;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    style={{
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    <IconComponent size={18} />
                    <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{cat.name.split('/')[0]}</span>
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
                  {availableBrands.map(b => (
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
                <label>Specify Custom Model</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type exact model name"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                />
              </div>
            )}

            {/* RAM & Storage */}
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

            {/* Year of Manufacture */}
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

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.4rem', padding: '0.75rem' }}
              onClick={() => setStep(2)}
            >
              Next: Condition & Anti-Theft IMEI Security <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Condition & Anti-Theft Authentication */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Step 2 of 2</span>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', marginTop: '0.15rem' }}>Condition, Accessories & Anti-Theft Check</h4>
              </div>
              <button onClick={() => setStep(1)} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                Back
              </button>
            </div>

            {/* Condition List */}
            <div className="form-group">
              <label>Working Condition</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {CONDITION_GRADES.map(c => {
                  const isSelected = conditionId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setConditionId(c.id)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: isSelected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.85rem' }}>
                          {c.grade}
                        </span>
                        {isSelected && <CheckCircle2 size={16} color="var(--primary)" />}
                      </div>
                      <p style={{ margin: '0.15rem 0 0', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {c.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anti-Theft IMEI or Serial Check */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.825rem' }}>
                  <ShieldCheck size={15} /> Anti-Theft Security: {currentCat.requiresImei ? '15-Digit IMEI' : 'Serial Number (S/N)'}
                </label>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>CEIR / GSMA Check</span>
              </div>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>
                {currentCat.requiresImei ? 'Dial *#06# on device keypad. Authenticates device is clean.' : 'Enter hardware serial number.'}
              </p>
              <div style={{ display: 'flex', gap: '0.45rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={currentCat.requiresImei ? 'Enter 15-digit IMEI' : 'Enter Serial Number'}
                  value={imeiOrSerial}
                  onChange={(e) => {
                    setImeiOrSerial(e.target.value);
                    setImeiResult(null);
                  }}
                  style={{ fontSize: '0.825rem', padding: '0.55rem 0.75rem' }}
                />
                <button
                  type="button"
                  onClick={handleVerifyImei}
                  className="btn btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                >
                  Verify Clean
                </button>
              </div>

              {imeiResult && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  background: imeiResult.valid ? 'var(--primary-light)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${imeiResult.valid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  color: imeiResult.valid ? 'var(--primary)' : '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  {imeiResult.valid ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                  <span>{imeiResult.message}</span>
                </div>
              )}
            </div>

            {/* Accessories */}
            <div className="form-group">
              <label>Included Accessories (Increases Value)</label>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
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
                        background: isChecked ? 'var(--primary-light)' : 'var(--bg-secondary)',
                        borderColor: isChecked ? 'var(--primary)' : 'var(--border)',
                        color: isChecked ? 'var(--primary)' : 'var(--text-muted)'
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
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Calculating 3R Pathway & Payout...' : 'Run 3R Diagnosis & Carbon Analysis'}
            </button>
          </div>
        )}

        {/* STEP 3: Results & 3R Circular Recommendation */}
        {step === 3 && result && (
          <div>
            {/* 3R Strategy Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '1.1rem 1.25rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="role-badge" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                  3R Pillar: {result.threeR}
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>AI Circular Analysis</span>
              </div>
              <h4 style={{ margin: '0 0 0.35rem', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>
                {result.strategy}
              </h4>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {result.rationale}
              </p>
            </div>

            {/* Guaranteed Buyback Banner */}
            <div style={{
              background: 'var(--primary-light)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--primary)',
              fontSize: '0.8rem'
            }}>
              <Recycle size={18} />
              <span>
                <strong>Guaranteed Cash Buyback:</strong> Even if you choose to sell rather than keep, our verified collection agents guarantee cash settlement at your doorstep!
              </span>
            </div>

            {/* Estimated Payout */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '0.95rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Doorstep Cash Payout Range</span>
                <h3 style={{ margin: '0.1rem 0 0', color: 'var(--primary)', fontSize: '1.45rem', fontWeight: 700 }}>
                  ₹{result.minRange.toLocaleString()} – ₹{result.maxRange.toLocaleString()}
                </h3>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div>Avg: ₹{result.estimatedPrice.toLocaleString()}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Instant Doorstep UPI / Cash</div>
              </div>
            </div>

            {/* Environmental Impact Metrics */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Carbon Footprint Reduction
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.35rem' }}>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.65rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>{result.co2Saved} kg</div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>CO₂e Saved</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.65rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--secondary)' }}>{result.treesEquivalent}</div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Trees Absorbed</div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.65rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#a78bfa' }}>{result.kmAvoided} km</div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Car Travel Saved</div>
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
                Sell Device (₹{result.estimatedPrice}) <ArrowRight size={15} />
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
