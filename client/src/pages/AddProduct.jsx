import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, ArrowLeft, CheckCircle2, Upload } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productAge, setProductAge] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

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

    // Step 1: get a presigned PUT URL from our API
    const { data } = await API.post('/uploads/presign', {
      filename: imageFile.name,
      contentType: imageFile.type
    });

    // Step 2: PUT the file directly to S3 (no auth header — it's a presigned URL)
    await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': imageFile.type },
      body: imageFile
    });

    return data.imageKey;
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
      // Upload image first (if provided), then create the product record
      const imageKey = await uploadImageToS3();

      await API.post('/products', {
        productName,
        productAge,
        productPrice,
        ...(imageKey ? { imageKey } : {})
      });

      setSuccess('Product added successfully! Initial status set to Pending.');
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
    <div style={{ maxWidth: '540px', margin: '2rem auto' }}>
      <button onClick={() => navigate('/customer')} className="btn btn-outline" style={{ marginBottom: '1rem', padding: '0.4rem 0.8rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#064e3b' }}>
          Add E-Waste Product
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Enter details of the e-waste item you wish to dispose / recycle
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success"><CheckCircle2 size={16} style={{ marginRight: '0.5rem' }} />{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dell Monitor, HP Printer, Old Smartphone"
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
              placeholder="e.g. 2 Years, 6 Months"
              value={productAge}
              onChange={(e) => setProductAge(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Estimated Price / Value (₹) *</label>
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
            <label>Product Photo (optional)</label>
            <label
              htmlFor="photo-upload"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                cursor: 'pointer', border: '1px dashed #d1d5db',
                borderRadius: '6px', padding: '0.75rem 1rem',
                color: '#6b7280', fontSize: '0.9rem', background: '#f9fafb'
              }}
            >
              <Upload size={16} />
              {imageFile ? imageFile.name : 'Click to choose an image (JPEG / PNG / WebP)'}
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
                style={{ marginTop: '0.75rem', maxHeight: '180px', borderRadius: '6px', objectFit: 'cover', width: '100%' }}
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
            {loading ? 'Submitting...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
