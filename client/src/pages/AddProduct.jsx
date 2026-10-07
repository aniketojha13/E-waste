import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, ArrowLeft, CheckCircle2, Upload, AlertCircle, Sparkles } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read prefilled data from AI Bot if routed from EcoBot
  const aiState = location.state || {};

  const [productName, setProductName] = useState(aiState.productName || '');
  const [productAge, setProductAge] = useState(aiState.productAge || '');
  const [productPrice, setProductPrice] = useState(aiState.productPrice || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      // Step 1: get a presigned PUT URL from our API
      const { data } = await API.post('/uploads/presign', {
        filename: imageFile.name,
        contentType: imageFile.type
      });

      // Step 2: PUT the file directly to S3
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': imageFile.type },
        body: imageFile
      });

      return data.imageKey;
    } catch (uploadErr) {
      console.warn('S3 upload skipped or not configured:', uploadErr.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!productName || !productAge || !productPrice) {
      setError('Please fill in product name, age, and estimated price.');
      return;
    }

    setLoading(true);
    try {
      const imageKey = await uploadImageToS3();

      await API.post('/products', {
        productName,
        productAge,
        productPrice: Number(productPrice),
        ...(imageKey ? { imageKey } : {})
      });

      setSuccess('Product listed successfully! Initial status set to Pending.');
      setProductName('');
      setProductAge('');
      setProductPrice('');
      setImageFile(null);
      setImagePreview(null);
      setLoading(false);

      setTimeout(() => navigate('/my-products'), 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '2rem auto' }}>
      <button onClick={() => navigate('/customer')} className="btn btn-outline" style={{ marginBottom: '1.25rem', padding: '0.4rem 0.85rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="card">
        {aiState.productName && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'rgba(16, 185, 129, 0.15)', 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            borderRadius: '10px', 
            padding: '0.65rem 1rem', 
            marginBottom: '1.25rem',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <Sparkles size={16} /> Pre-filled with EcoBot AI Analysis details
          </div>
        )}

        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#f8fafc', fontSize: '1.8rem' }}>
          Add E-Waste Product
        </h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
          Submit electronic items for doorstep collection and payment
        </p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product / Device Name *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Dell Monitor, HP Printer, iPhone 12..."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Product Age *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 2 Years, 6 Months, 4+ Years..."
              value={productAge}
              onChange={(e) => setProductAge(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Estimated Value (₹) *</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 1500"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Product Photo (Optional)</label>
            <label
              htmlFor="photo-upload"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                cursor: 'pointer', border: '1px dashed rgba(148, 163, 184, 0.3)',
                borderRadius: '10px', padding: '0.85rem 1rem',
                color: '#94a3b8', fontSize: '0.9rem', background: 'rgba(15, 23, 42, 0.6)'
              }}
            >
              <Upload size={18} color="#34d399" />
              {imageFile ? imageFile.name : 'Choose an image file (JPEG / PNG / WebP)'}
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
                alt="Preview"
                style={{ marginTop: '0.85rem', maxHeight: '180px', borderRadius: '10px', objectFit: 'cover', width: '100%', border: '1px solid var(--border)' }}
              />
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <PlusCircle size={18} />
            {loading ? 'Submitting Product...' : 'Submit E-Waste for Collection'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
