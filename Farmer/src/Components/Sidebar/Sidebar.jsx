import React, { useState } from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { GrDashboard } from 'react-icons/gr';
import { FaBoxOpen, FaListAlt, FaExchangeAlt, FaCloudSun, FaChartLine } from 'react-icons/fa';

export const Sidebar = () => {
  const location = useLocation(); // Get current route
  const [active, setActive] = useState(location.pathname); // Track active menu

  const menuItems = [
    { path: '/dashboard', icon: <GrDashboard className="icon" />, label: 'Dashboard' },
    { path: '/addproduct', icon: <FaBoxOpen className="icon add-product" />, label: 'Add Product' },
    { path: '/listproduct', icon: <FaListAlt className="icon"/>, label: 'Product List' },
    { path: '/transaction', icon: <FaExchangeAlt className="icon transaction" />, label: 'Transactions' },
    { path: '/weather', icon: <FaCloudSun className="icon weather" />, label: 'Weather' },
    { path: '/scrapping', icon: <FaChartLine className="icon market" />, label: 'Market Prices' }
  ];

  return (
    <div className="sidebar">
      {menuItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`sidebar-item ${active === item.path ? 'active' : ''}`}
          onClick={() => setActive(item.path)}
        >
          {item.icon}
          <p>{item.label}</p>
        </Link>
      ))}
    </div>
  );
};
