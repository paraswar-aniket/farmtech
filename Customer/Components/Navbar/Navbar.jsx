import React, { useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo_icon.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import nav_dropdown from '../Assets/nav_dropdown.png';
import { FaUserCircle, FaShoppingBag } from 'react-icons/fa';

export const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  // Toggles the 'open' class on the dropdown icon
  const dropdown_toggle = (e) => {
    e.currentTarget.classList.toggle('open');
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('x-access-token'); // Remove token
    navigate('/'); // Redirect to home
  };

  // Redirects to login/signup
  const handleLoginClick = () => {
    navigate('/login');
  };
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirects to cart if logged in, else to login
  const handleCartClick = () => {
    if (localStorage.getItem('x-access-token')) {
      navigate('/cart');
    } else {
      handleLoginClick();
    }
  };

  // Redirects to transactions page
  const handleTransactionsClick = () => {
    navigate('/transactions');
  };

  // Category change handler
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    
    // Map the category to the corresponding menu item
    if (category === 'Fruits') {
      setMenu('fruits');
      navigate('/fruits');
    } else if (category === 'Vegetables') {
      setMenu('vegetables');
      navigate('/vegetables');
    } else if (category === 'Grains') {
      setMenu('grains');
      navigate('/grains');
    } else {
      setMenu('shop');
      navigate('/');
    }
  };

  // Check if the user is logged in
  const isUserLoggedIn = !!localStorage.getItem('x-access-token');

  return (
    <div className='navbar'>
      {/* LOGO SECTION */}
      <div className='nav-logo'>
        <img src={logo} alt="Logo" />
        <p><span className="far-text">Far</span><span className="mart-text">mart</span></p>
      </div>

      {/* HAMBURGER ICON (visible on mobile) */}
      <img 
        className='nav-dropdown' 
        src={nav_dropdown} 
        onClick={dropdown_toggle} 
        alt="Dropdown" 
      />

      {/* SHOP AND CATEGORY SECTION */}
      <div className="nav-center">
        <div className="shop-button" onClick={() => { setMenu("shop"); navigate('/'); }}>
          <div className="shop-icon-container">
            <FaShoppingBag />
          </div>
          <span>Shop</span>
        </div>

        {/* Category Dropdown */}
        <div className="category-select-container">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-dropdown"
          >
            <option value="All">Choose Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Grains">Grains</option>
          </select>
        </div>
      </div>

      {/* CART AND PROFILE SECTION */}
      <div className="nav-right">
        <div onClick={handleCartClick} className="cart-button">
          <div className="cart-icon-container">
            <img src={cart_icon} alt="Cart" />
          </div>
          <span>Your Cart</span>
        </div>

        {isUserLoggedIn ? (
          <div className="profile-button">
            <FaUserCircle className="profile-icon" />
            <span>Welcome, {user.name}</span>
            <div className="profile-dropdown">
              <button onClick={handleTransactionsClick}>Transactions</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="profile-button" onClick={handleLoginClick}>
            <FaUserCircle className="profile-icon" />
            <span>Profile</span>
          </div>
        )}
      </div>
    </div>
  );
};