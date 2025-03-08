import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import farmScene from "../../../src/assets/farm_scene.png";
import logo from "../../../src/assets/logo.png";
import farmerIcon from "../../../src/assets/farmer_icon.png";
import inventoryIcon from "../../../src/assets/inventory_icon.png";
import paymentIcon from "../../../src/assets/payment_icon.png";
import userIcon from "../../../src/assets/user_icon.png"; 

export const HomePage = () => {
  const navigate = useNavigate();

  // Navigate to login page on button click
  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleBecomeMember = () => {
    navigate('/login');
  };

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <span className="email">Careers@farmart</span>
        <span className="about">About Us.</span>
        <div className="logo">
          <img src={logo} alt="Farmart Logo" />
        </div>
        <div className="location">
          <span>Change Location &gt;</span>
          <p>Mumbai.</p>
        </div>
        <button className="get-started" onClick={handleGetStarted}>
          Get Started &gt;
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h2>
          The One-Stop Destination for Connecting Farmers and{" "}
          <span className="consumer-text">Consumers</span>..!
        </h2>
        <button className="member-btn" onClick={handleBecomeMember}>
          Become a Member &gt;
        </button>
      </section>

      {/* Illustration */}
      <div className="illustration">
        <img src={farmScene} alt="Farm Scene" className="farm-scene" />
      </div>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h3>
          Why Choose <span className="highlight">Us?</span>
        </h3>
        <div className="features">
          <div className="feature-box">
            <img src={farmerIcon} alt="Farmer Marketplace" />
            <h4>
              <span className="checkmark">✓</span> Farmer Marketplace
            </h4>
            <p>
              Connects farmers directly with buyers for fair pricing and better profits.
            </p>
          </div>
          <div className="feature-box">
            <img src={inventoryIcon} alt="Smart Inventory Management" />
            <h4>
              <span className="checkmark">✓</span> Smart Inventory Management
            </h4>
            <p>
              Connects farmers directly with buyers for fair pricing and better profits.
            </p>
          </div>
          <div className="feature-box">
            <img src={paymentIcon} alt="Digital Payments & Transactions" />
            <h4>
              <span className="checkmark">✓</span> Digital Payments & Transactions
            </h4>
            <p>
              Connects farmers directly with buyers for fair pricing and better profits.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <h3>
          "Empowering Farmers, flourishing the <span className="highlight">Nation</span>."
        </h3>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonial-cards">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="testimonial">
              <h4>
                Rajesh Kumar<br/>(Farmer, Maharashtra)
              </h4>
              <img src={userIcon} alt="User Icon" className="user-role" />
              <p>
                "This software has transformed the way I manage my farm. From tracking inventory to selling produce, everything is seamless!"
              </p>
            </div>
          ))}
        </div>
        <div className="testimonial-footer">
          Testimonies from our Trusted Members.
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <p>All rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
