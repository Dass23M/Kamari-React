// src/pages/Supplier.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import './Supplier.css';
import { Link } from 'react-router-dom';

const Supplier = () => {
  const colors = {
    primary: '#2B2D42',    // Sophisticated deep slate
    secondary: '#EDF2F4',  // Soft neutral background
    accent: '#EF233C',     // Vibrant red accent
    text: '#2B2D42',       // Dark slate text
    card: '#FFFFFF',       // Clean white cards
    hover: '#8D99AE'       // Subtle hover gray
  };

  const apiUrl = 'http://localhost:3000/api/suppliers';

  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    email: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  // Load suppliers on component mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(apiUrl, formData);
      setMessage('Supplier added successfully!');
      setFormData({ name: '', tel: '', email: '', address: '' });
      loadSuppliers();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding supplier');
    }
  };

  const loadSuppliers = async () => {
    try {
      const res = await axios.get(apiUrl);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err.message);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <BarChart2 size={32} style={{ color: colors.primary }} />
            <h1 style={{ color: colors.primary }}>Supplier Manager</h1>
          </div>
          <a href="/" className="back-link">
            <ArrowLeft size={24} style={{ color: colors.hover }} />
            <span>Back to Dashboard</span>
          </a>
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
          <form onSubmit={handleSubmit} className="supplier-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tel">Telephone:</label>
              <input
                type="text"
                id="tel"
                value={formData.tel}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="submit-button">
              Create Supplier
            </button>
          </form>

          {message && <div className="message">{message}</div>}
        </motion.div>

        <hr className="divider" />

        <div className="suppliers-list">
          <h2 style={{ color: colors.text }}>All Suppliers</h2>
          <ul>
            {suppliers.map((supplier, index) => (
              <li key={index}>
                {supplier.name} ({supplier.email})
              </li>
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

export default Supplier;