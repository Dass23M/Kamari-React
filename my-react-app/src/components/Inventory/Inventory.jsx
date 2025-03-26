// src/components/Inventory/Inventory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Inventory.css';

const Inventory = () => {
  const colors = {
    primary: '#2B2D42',
    secondary: '#EDF2F4',
    accent: '#EF233C',
    text: '#2B2D42',
    card: '#FFFFFF',
    hover: '#8D99AE'
  };

  const productApi = 'http://localhost:3000/api/products';
  const inventoryApi = 'http://localhost:3000/api/inventory';
  const stockApi = 'http://localhost:3000/api/stock-movements';
  const supplierApi = 'http://localhost:3000/api/suppliers';
  const supBrandApi = 'http://localhost:3000/api/sup-brands';

  const [formData, setFormData] = useState({
    product: '',
    size: '',
    color: '',
    description: '',
    quantity: '',
    buy_price: '',
    sell_price: ''
  });
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supBrands, setSupBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    barcode: '',
    name: '',
    price: '',
    supplier: ''
  });
  const [labelSize, setLabelSize] = useState({ width: 49, height: 24 });

  useEffect(() => {
    loadProducts();
    loadInventory();
    loadStockMovements();
    loadSuppliers();
    loadSupBrands();
  }, []);

  const loadProducts = async () => {
    const res = await axios.get(productApi);
    setProducts(res.data);
  };

  const loadInventory = async () => {
    const res = await axios.get(inventoryApi);
    setInventory(res.data);
  };

  const loadStockMovements = async () => {
    const res = await axios.get(stockApi);
    setStockMovements(res.data);
  };

  const loadSuppliers = async () => {
    const res = await axios.get(supplierApi);
    setSuppliers(res.data);
  };

  const loadSupBrands = async () => {
    const res = await axios.get(supBrandApi);
    setSupBrands(res.data);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = JSON.parse(formData.product);
    const { id: productId, gender, type } = productData;

    try {
      const genderCode = gender === 'female' ? 'W' : gender === 'male' ? 'M' : 'U';
      const typeMap = {
        UpperBody: 'UP',
        LowerBody: 'LO',
        FullBody: 'FU',
        UnderGarment: 'UN',
        Article: 'AR'
      };
      const prefix = `${genderCode}${typeMap[type]}`;
      const invRes = await axios.get(inventoryApi);
      const count = invRes.data.filter((i) => i.bCodeId.startsWith(prefix)).length;
      const padded = String(count + 1).padStart(5, '0');
      const bCodeId = `${prefix}${padded}`;

      const invResPost = await axios.post(inventoryApi, {
        productId,
        size: formData.size,
        color: formData.color,
        description: formData.description,
        bCodeId
      });
      const inventoryId = invResPost.data.id;

      await axios.post(stockApi, {
        inventoryId,
        quantity: parseInt(formData.quantity),
        movement_type: 'in',
        buy_price: parseFloat(formData.buy_price),
        sell_price: parseFloat(formData.sell_price)
      });

      setMessage(`✅ Inventory added with Barcode: ${bCodeId}`);
      setFormData({
        product: '',
        size: '',
        color: '',
        description: '',
        quantity: '',
        buy_price: '',
        sell_price: ''
      });
      loadInventory();
      loadStockMovements();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const getLatestSellPrice = (inventoryId) => {
    const entries = stockMovements.filter(
      (entry) => entry.inventoryId === inventoryId && entry.movement_type === 'in'
    );
    return entries.length ? entries[entries.length - 1].sell_price : '-';
  };

  const filterInventory = () => {
    return inventory.filter((inv) => {
      const product = products.find((p) => p.id === inv.productId);
      return (
        inv.bCodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const openDownloadModal = (barcode, name, price, supplier) => {
    setModalData({ barcode, name, price, supplier });
    setShowModal(true);
  };

  const closeDownloadModal = () => {
    setShowModal(false);
  };

  const updateLabelSize = () => {
    const width = parseFloat(document.getElementById('labelWidth')?.value || 49);
    const height = parseFloat(document.getElementById('labelHeight')?.value || 24);
    setLabelSize({ width, height });
  };

  const downloadBarcodeAsImage = () => {
    const container = document.getElementById('labelContainer');
    html2canvas(container, { useCORS: true, scale: 3 }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${modalData.barcode}.png`;
      link.click();
    });
  };

  const downloadBarcodeAsPDF = () => {
    const container = document.getElementById('labelContainer');
    html2canvas(container, { useCORS: true, scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: labelSize.width > labelSize.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [labelSize.width, labelSize.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, labelSize.width, labelSize.height);
      pdf.save(`${modalData.barcode}.pdf`);
    });
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <BarChart2 size={32} style={{ color: colors.primary }} />
            <h1 style={{ color: colors.primary }}>Inventory Manager</h1>
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
          <form onSubmit={handleSubmit} className="inventory-form">
            <div className="form-group">
              <label htmlFor="product">Select Product:</label>
              <select
                id="product"
                value={formData.product}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={JSON.stringify(p)}>
                    {`${p.name} (${p.gender} - ${p.type})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="size">Size:</label>
              <input
                type="text"
                id="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="color">Color:</label>
              <input
                type="text"
                id="color"
                value={formData.color}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="buy_price">Buy Price:</label>
              <input
                type="number"
                id="buy_price"
                value={formData.buy_price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sell_price">Sell Price:</label>
              <input
                type="number"
                id="sell_price"
                value={formData.sell_price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
            <button type="submit" className="submit-button">Add Inventory</button>
          </form>
          {message && <div className="message">{message}</div>}
        </motion.div>

        <hr className="divider" />

        <input
          type="text"
          id="search"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Product</th>
              <th>Size</th>
              <th>Color</th>
              <th>Price (Rs)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterInventory().map((inv) => {
              const product = products.find((p) => p.id === inv.productId);
              const supBr = supBrands.find((sb) => sb.id === product?.supBrId);
              const supplier = suppliers.find((s) => s.id === supBr?.supId);
              const sellPrice = getLatestSellPrice(inv.id);
              return (
                <tr key={inv.id}>
                  <td>{inv.bCodeId}</td>
                  <td>{product?.name || 'N/A'}</td>
                  <td>{inv.size}</td>
                  <td>{inv.color}</td>
                  <td>{sellPrice}</td>
                  <td>
                    <button
                      onClick={() =>
                        openDownloadModal(
                          inv.bCodeId,
                          product?.name || 'Product',
                          sellPrice,
                          supplier?.name || ''
                        )
                      }
                      className="action-button"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Barcode Download Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeDownloadModal}>×</span>
              <h3>Barcode Label Preview</h3>
              <div className="label-settings">
                <label>
                  Width (mm):{' '}
                  <input
                    type="number"
                    id="labelWidth"
                    value={labelSize.width}
                    onChange={(e) => {
                      setLabelSize((prev) => ({ ...prev, width: e.target.value }));
                      updateLabelSize();
                    }}
                  />
                </label>
                <label>
                  Height (mm):{' '}
                  <input
                    type="number"
                    id="labelHeight"
                    value={labelSize.height}
                    onChange={(e) => {
                      setLabelSize((prev) => ({ ...prev, height: e.target.value }));
                      updateLabelSize();
                    }}
                  />
                </label>
              </div>
              <div id="labelPreviewArea">
                <div
                  id="labelContainer"
                  style={{
                    width: `${labelSize.width * 3.7795}px`,
                    height: `${labelSize.height * 3.7795}px`
                  }}
                >
                  <div className="label-product">{modalData.name}</div>
                  <div className="label-price">Rs: {parseFloat(modalData.price).toFixed(2)}</div>
                  <img
                    id="barcodePreviewImg"
                    src={`http://localhost:3000/api/barcode/${modalData.barcode}`}
                    alt="Barcode Preview"
                  />
                  <div className="label-code">{modalData.barcode}</div>
                </div>
              </div>
              <div className="actions">
                <button onClick={downloadBarcodeAsImage} className="action-button">
                  Download PNG
                </button>
                <button onClick={downloadBarcodeAsPDF} className="action-button">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Kamari Inventory Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Inventory;