// src/pages/Home.jsx
import React from 'react';
import { 
  Package, 
  Truck, 
  Layers, 
  BarChart2, 
  UserCheck, 
  Search,
  Bell,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const Home = () => {
  const colors = {
    primary: '#2B2D42',    // Sophisticated deep slate
    secondary: '#EDF2F4',  // Soft neutral background
    accent: '#EF233C',     // Vibrant red accent
    text: '#2B2D42',       // Dark slate text
    card: '#FFFFFF',       // Clean white cards
    hover: '#8D99AE'       // Subtle hover gray
  };

  const navItems = [
    {
      title: 'Supplier Dashboard',
      href: '/suppliers',
      icon: <UserCheck size={28} />,
      stats: '24 Active Suppliers',
      color: '#2196F3'
    },
    {
      title: 'Brand Management',
      href: '/brands',
      icon: <Layers size={28} />,
      stats: '15 Brands',
      color: '#4CAF50'
    },
    {
      title: 'Product Catalog',
      href: '/products',
      icon: <Package size={28} />,
      stats: '1,245 SKUs',
      color: '#F44336'
    },
    {
      title: 'Inventory Control',
      href: '/inventory',
      icon: <Truck size={28} />,
      stats: '89% In Stock',
      color: '#FFC107'
    }
  ];

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <BarChart2 size={32} style={{ color: colors.primary }} />
            <h1 style={{ color: colors.primary }}>Kamari Inventory</h1>
          </div>
          <div className="header-right">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search inventory..."
                className="search-input"
              />
            </div>
            <Bell size={24} className="icon hover-icon" style={{ color: colors.hover }} />
            <div className="user-profile">
              <User size={24} style={{ color: colors.hover }} />
              <span>Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h2 style={{ color: colors.primary }}>Dashboard Overview</h2>
          <p>Manage your clothing inventory with real-time insights</p>
        </div>

        <div className="nav-grid">
          {navItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="nav-card-link"
            >
              <div 
                className="nav-card"
                style={{ borderLeft: `4px solid ${item.color}` }}
              >
                <div className="nav-card-content">
                  <div style={{ color: colors.primary }}>{item.icon}</div>
                  <div className="nav-card-text">
                    <h3 style={{ color: colors.text }}>{item.title}</h3>
                    <p>{item.stats}</p>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="stats-section">
          <div className="recent-activity">
            <h3 style={{ color: colors.text }}>Recent Activity</h3>
            <ul>
              <li>New shipment received - 150 units</li>
              <li>Supplier updated: Vogue Textiles</li>
              <li>Low stock alert: Item #SKU123</li>
            </ul>
          </div>
          <div className="inventory-status">
            <h3 style={{ color: colors.text }}>Inventory Status</h3>
            <div className="stats-grid">
              <div>
                <p>Total Items</p>
                <p style={{ color: colors.primary }}>1,245</p>
              </div>
              <div>
                <p>Categories</p>
                <p style={{ color: colors.primary }}>28</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Kamari Inventory Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;