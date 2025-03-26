// src/components/Product/Product.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const colors = {
    primary: '#2B2D42',    // Sophisticated deep slate
    secondary: '#EDF2F4',  // Soft neutral background
    accent: '#EF233C',     // Vibrant red accent
    text: '#2B2D42',       // Dark slate text
    card: '#FFFFFF',       // Clean white cards
    hover: '#8D99AE'       // Subtle hover gray
  };

  const supplierApi = 'http://localhost:3000/api/suppliers';
  const brandApi = 'http://localhost:3000/api/brands';
  const supBrandApi = 'http://localhost:3000/api/sup-brands';
  const productApi = 'http://localhost:3000/api/products';

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    type: '',
    supplier: '',
    brand: ''
  });
  const [message, setMessage] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadSuppliers();
    loadBrands();
    loadProducts();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await axios.get(supplierApi);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err.message);
    }
  };

  const loadBrands = async () => {
    try {
      const res = await axios.get(brandApi);
      setBrands(res.data);
    } catch (err) {
      console.error('Error fetching brands:', err.message);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await axios.get(productApi);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, gender, type, supplier: supId, brand: brandId } = formData;

    try {
      // Check if sup_brand exists
      let supBrandId;
      const res = await axios.get(`${supBrandApi}/get/${supId}/${brandId}`);
      supBrandId = res.data;

      // Create product
      await axios.post(productApi, {
        name,
        gender,
        type,
        supBrId: supBrandId
      });

      setMessage('✅ Product created!');
      setFormData({ name: '', gender: '', type: '', supplier: '', brand: '' });
      loadProducts();
    } catch (err) {
      // If sup_brand doesn’t exist, create it then try again
      if (err.response?.status === 400 || err.response?.status === 404) {
        try {
          const newSupBrand = await axios.post(supBrandApi, { supId, brandId });
          const supBrandId = newSupBrand.data.id;

          await axios.post(productApi, {
            name,
            gender,
            type,
            supBrId: supBrandId
          });

          setMessage('✅ Product created!');
          setFormData({ name: '', gender: '', type: '', supplier: '', brand: '' });
          loadProducts();
        } catch (error) {
          setMessage('❌ Error creating product');
          console.error(error);
        }
      } else {
        setMessage('❌ ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <BarChart2 size={32} style={{ color: colors.primary }} />
            <h1 style={{ color: colors.primary }}>Product Manager</h1>
          </div>
          <Link to="/" className="back-link">
            <ArrowLeft size={24} style={{ color: colors.hover }} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="form-container"
        >
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Type --</option>
                <option value="UpperBody">UpperBody</option>
                <option value="LowerBody">LowerBody</option>
                <option value="FullBody">FullBody</option>
                <option value="UnderGarment">UnderGarment</option>
                <option value="Article">Article</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="supplier">Supplier:</label>
              <select
                id="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand:</label>
              <select
                id="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Brand --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Create Product
            </button>
          </form>

          {message && <div className="message">{message}</div>}
        </motion.div>

        <hr className="divider" />

        <div className="products-list">
          <h2 style={{ color: colors.text }}>Products</h2>
          <ul>
            {products.map((p, index) => (
              <li key={index}>{`${p.name} (${p.gender} - ${p.type})`}</li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Kamari Inventory Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Product;