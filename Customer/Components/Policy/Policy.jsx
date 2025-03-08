import React from 'react';
import { Wallet, RefreshCw, Headphones } from 'lucide-react';
import tractorImage from '../Assets/tractor.png'; // Import the tractor image
import './Policy.css'; // Importing the CSS file

const PolicyCard = ({ title, icon }) => (
  <div className="policy-card">
    <div className="policy-icon">{icon}</div>
    <h3 className="policy-title">{title}</h3>
  </div>
);

export const Policy = () => {
  return (
    <section className="policy-section">
      <div className="policy-container">
        <h2 className="policy-heading">Our Policy</h2>

        <div className="policy-grid">
          <PolicyCard 
            title="All Payment Methods Available"
            icon={<Wallet className="policy-icon-size" />}
          />
          <PolicyCard 
            title="Flexible Return Policy"
            icon={<RefreshCw className="policy-icon-size" />}
          />
          <PolicyCard 
            title="Reliable Customer Support"
            icon={<Headphones className="policy-icon-size" />}
          />
        </div>

        <div className="policy-image-container">
          <img 
            src={tractorImage}
            alt="Farm Tractor in Field"
            className="policy-image"
          />
        </div>
      </div>
    </section>
  );
};
