// src/components/Brand/Brand.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Brand.css';


const Brand = () => {
  const colors = {
    primary: '#2B2D42',    // Sophisticated deep slate
    secondary: '#EDF2F4',  // Soft neutral background
    accent: '#EF233C',     // Vibrant red accent
    text: '#2B2D42',       // Dark slate text
    card: '#FFFFFF',       // Clean white cards
    hover: '#8D99AE'       // Subtle hover gray
  };

  const apiUrl = 'http://localhost:3000/api/brands';

  const [brandName, setBrandName] = useState('');
  const [message, setMessage] = useState('');
  const [brands, setBrands] = useState([]);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(apiUrl, { name: brandName });
      setMessage('✅ Brand added successfully!');
      setBrandName('');
      loadBrands();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Error adding brand'));
    }
  };

  const loadBrands = async () => {
    try {
      const res = await axios.get(apiUrl);
      setBrands(res.data);
    } catch (err) {
      console.error('Error fetching brands:', err.message);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <BarChart2 size={32} style={{ color: colors.primary }} />
            <h1 style={{ color: colors.primary }}>Brand Manager</h1>
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
          <form onSubmit={handleSubmit} className="brand-form">
            <div className="form-group">
              <label htmlFor="brandName">Brand Name:</label>
              <input
                type="text"
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Add Brand
            </button>
          </form>

          {message && <div className="message">{message}</div>}
        </motion.div>

        <hr className="divider" />

        <div className="brands-list">
          <h2 style={{ color: colors.text }}>All Brands</h2>
          <ul>
            {brands.map((brand, index) => (
              <li key={index}>{brand.name}</li>
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

export default Brand;