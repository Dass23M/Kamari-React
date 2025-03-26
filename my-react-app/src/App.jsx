// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Supplier from './components/Supplier/Supplier';
import Brand from './components/Brand/Brand';
import Inventory from './components/Inventory/Inventory';
import Product from './components/Product/Product'; // Import Product

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suppliers" element={<Supplier />} />
        <Route path="/brands" element={<Brand />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/products" element={<Product />} /> {/* Add Product route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;