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
  Clock, 
  RotateCcw, 
  Zap, 
  TreePine, 
  Car, 
  Cpu, 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tv, 
  HelpCircle 
} from 'lucide-react';

const DEVICE_CATEGORIES = [
  { id: 'smartphone', name: 'Smartphone', icon: Smartphone, co2Base: 70, basePrice: 15000 },
  { id: 'laptop', name: 'Laptop', icon: Laptop, co2Base: 240, basePrice: 40000 },
  { id: 'desktop', name: 'Desktop PC', icon: Cpu, co2Base: 350, basePrice: 35000 },
  { id: 'tablet', name: 'Tablet', icon: Smartphone, co2Base: 110, basePrice: 20000 },
  { id: 'monitor', name: 'LED Monitor', icon: Monitor, co2Base: 130, basePrice: 12000 },
  { id: 'appliance', name: 'Home Appliance', icon: Tv, co2Base: 180, basePrice: 18000 }
];

const AGE_OPTIONS = [
  { id: 'under_1', label: '< 1 Year Old', multiplier: 0.65 },
  { id: '1_to_2', label: '1 - 2 Years Old', multiplier: 0.45 },
  { id: '2_to_3', label: '2 - 3 Years Old', multiplier: 0.28 },
  { id: '3_to_5', label: '3 - 5 Years Old', multiplier: 0.15 },
  { id: 'over_5', label: '5+ Years Old', multiplier: 0.06 }
];

const CONDITION_OPTIONS = [
  { id: 'flawless', label: 'Working Perfectly (Like New)', factor: 1.0, advice: 'high_value' },
  { id: 'minor', label: 'Working with Minor Issues (Battery / Scratches)', factor: 0.75, advice: 'upgrade' },
  { id: 'damaged', label: 'Functional but Damaged (Cracked Screen / Keys)', factor: 0.4, advice: 'repair_or_sell' },
  { id: 'dead', label: 'Dead / Won\'t Turn On (Motherboard / Water Damage)', factor: 0.15, advice: 'recycle' }
];

export const DeviceAiBotModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(DEVICE_CATEGORIES[0].id);
  const [modelName, setModelName] = useState('');
  const [age, setAge] = useState(AGE_OPTIONS[1].id);
  const [condition, setCondition] = useState(CONDITION_OPTIONS[1].id);
  const [storageRam, setStorageRam] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const catObj = DEVICE_CATEGORIES.find(c => c.id === category) || DEVICE_CATEGORIES[0];
      const ageObj = AGE_OPTIONS.find(a => a.id === age) || AGE_OPTIONS[1];
      const condObj = CONDITION_OPTIONS.find(c => c.id === condition) || CONDITION_OPTIONS[1];

      // Valuation algorithm
      const estimatedPrice = Math.round(catObj.basePrice * ageObj.multiplier * condObj.factor / 100) * 100;
      const minPrice = Math.max(200, Math.round(estimatedPrice * 0.85 / 50) * 50);
      const maxPrice = Math.round(estimatedPrice * 1.15 / 50) * 50;

      // Carbon emission savings math (kg of CO2 equivalent saved vs buying new)
      const co2Saved = Math.round(catObj.co2Base * (condObj.id === 'dead' ? 0.6 : 0.88));
      const treesEquivalent = (co2Saved / 21).toFixed(1); // 1 mature tree absorbs ~21kg CO2/yr
      const kmCarAvoided = Math.round(co2Saved * 4.2); // ~0.24 kg CO2 per km car driving

      // Decision engine logic: Sell vs Use vs Recycle
      let recommendation = '';
      let recommendationType = ''; // 'sell', 'use', 'recycle'
      let actionDetails = '';

      if (condObj.id === 'dead' || age === 'over_5') {
        recommendationType = 'recycle';
        recommendation = '♻️ Certified E-Waste Recycling Recommended';
        actionDetails = `This device has reached the end of its viable lifecycle. Repair costs will exceed market value. Recycling it safely recovers valuable metals (Gold, Silver, Copper) and prevents toxic chemicals from poisoning landfills.`;
      } else if (condObj.id === 'minor' && (age === '1_to_2' || age === '2_to_3')) {
        recommendationType = 'use';
        recommendation = '⏳ Keep & Use for 1–2 More Years (Smart Choice)';
        actionDetails = `Your ${modelName || catObj.name} still has plenty of life! With a minor battery replacement or fresh software reset, you can comfortably use this device for another 18 to 24 months. This saves you money and eliminates immediate carbon footprint!`;
      } else if (age === 'under_1' || condObj.id === 'flawless') {
        recommendationType = 'sell';
        recommendation = '💰 Sell Now for Maximum Cash Return';
        actionDetails = `Optimal resale window! Your device currently retains substantial market value (estimated ₹${minPrice} - ₹${maxPrice}). Electronics depreciate 20-30% every 6 months. Selling now gives you maximum recovery before value plummets.`;
      } else {
        recommendationType = 'sell';
        recommendation = '📦 Sell or Trade-In on E-Waste Portal';
        actionDetails = `A balanced choice: sell now to a certified buyer or agent to recover ₹${minPrice} - ₹${maxPrice} while ensuring responsible refurbishment.`;
      }

      setAnalysisResult({
        category: catObj.name,
        modelName: modelName || `${catObj.name} (${ageObj.label})`,
        ageLabel: ageObj.label,
        conditionLabel: condObj.label,
        minPrice,
        maxPrice,
        estimatedPrice,
        co2Saved,
        treesEquivalent,
        kmCarAvoided,
        recommendation,
        recommendationType,
        actionDetails
      });

      setIsAnalyzing(false);
      setStep(3);
    }, 1200);
  };

  const handleProceedToListing = () => {
    onClose();
    if (analysisResult) {
      // Navigate to add-product with pre-filled state
      navigate('/add-product', {
        state: {
          productName: analysisResult.modelName,
          productAge: analysisResult.ageLabel,
          productPrice: analysisResult.estimatedPrice
        }
      });
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnalysisResult(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                EcoBot AI <Sparkles size={16} color="#34d399" />
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                Smart Device Diagnosis & Carbon Footprint Engine
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: Device Selection */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 700, letterSpacing: '0.05em' }}>Step 1 of 2</span>
              <h4 style={{ color: '#f8fafc', fontSize: '1.15rem', marginTop: '0.25rem' }}>Select Device Category & Model</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {DEVICE_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const selected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    style={{
                      background: selected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      border: selected ? '2px solid #10b981' : '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '1rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: selected ? '#34d399' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={24} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-group">
              <label>Brand & Model Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Apple iPhone 12, Dell Inspiron 15, HP LaserJet..."
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Configuration / Storage (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 128 GB Storage, 8GB RAM / 512GB SSD..."
                value={storageRam}
                onChange={(e) => setStorageRam(e.target.value)}
              />
            </div>

            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setStep(2)}
            >
              Continue to Condition & Age <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Age & Condition */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#34d399', fontWeight: 700, letterSpacing: '0.05em' }}>Step 2 of 2</span>
                <h4 style={{ color: '#f8fafc', fontSize: '1.15rem', marginTop: '0.25rem' }}>Age & Working Condition</h4>
              </div>
              <button onClick={() => setStep(1)} className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
                Back
              </button>
            </div>

            <div className="form-group">
              <label>How Old is the Device?</label>
              <select 
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                className="form-input"
              >
                {AGE_OPTIONS.map(a => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Current Physical & Working Condition</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {CONDITION_OPTIONS.map(c => {
                  const selected = condition === c.id;
                  return (
                    <div 
                      key={c.id}
                      onClick={() => setCondition(c.id)}
                      style={{
                        padding: '0.85rem 1rem',
                        background: selected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                        border: selected ? '1.5px solid #10b981' : '1px solid var(--border)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', color: selected ? '#34d399' : '#e2e8f0', fontWeight: selected ? 600 : 400 }}>
                        {c.label}
                      </span>
                      {selected && <CheckCircle2 size={18} color="#10b981" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-glow" 
              style={{ width: '100%', marginTop: '1.25rem' }}
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>Analyzing Device with EcoBot AI...</>
              ) : (
                <>
                  <Sparkles size={18} /> Analyze What To Do & Carbon Emission
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: AI Intelligence Analysis Results */}
        {step === 3 && analysisResult && (
          <div>
            {/* Recommendation Banner */}
            <div style={{
              background: analysisResult.recommendationType === 'sell' 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)'
                : analysisResult.recommendationType === 'use'
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34d399' }}>
                AI VERDICT & STRATEGY
              </span>
              <h3 style={{ margin: '0.4rem 0', color: '#ffffff', fontSize: '1.3rem' }}>
                {analysisResult.recommendation}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                {analysisResult.actionDetails}
              </p>
            </div>

            {/* Price & Valuation Card */}
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.8)', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '1rem 1.25rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.25rem' 
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Estimated E-Waste / Resale Value</span>
                <h4 style={{ margin: '0.2rem 0', color: '#34d399', fontSize: '1.4rem' }}>
                  ₹{analysisResult.minPrice} – ₹{analysisResult.maxPrice}
                </h4>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.65rem', borderRadius: '10px' }}>
                <DollarSign size={24} color="#10b981" />
              </div>
            </div>

            {/* Carbon Emission Savings Highlights */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Leaf size={18} color="#34d399" />
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem' }}>
                  Environmental Impact & Carbon Saved
                </h4>
              </div>

              <div className="carbon-metric-grid">
                <div className="carbon-metric-card">
                  <div className="value">{analysisResult.co2Saved} kg</div>
                  <div className="label">CO₂e Emission Saved</div>
                </div>

                <div className="carbon-metric-card">
                  <div className="value" style={{ color: '#38bdf8' }}>{analysisResult.treesEquivalent}</div>
                  <div className="label">Trees Equal Absorbed</div>
                </div>

                <div className="carbon-metric-card">
                  <div className="value" style={{ color: '#a78bfa' }}>{analysisResult.kmCarAvoided} km</div>
                  <div className="label">Car Emissions Avoided</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={handleReset}
              >
                <RotateCcw size={16} /> Analyze Another
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                onClick={handleProceedToListing}
              >
                List for Pickup (₹{analysisResult.estimatedPrice}) <ArrowRight size={18} />
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
    <button className="ai-bot-fab" onClick={onClick} title="EcoBot AI Device Analyzer">
      <Bot size={20} />
      <span>Analyze Device AI</span>
      <Sparkles size={14} />
    </button>
  );
};
