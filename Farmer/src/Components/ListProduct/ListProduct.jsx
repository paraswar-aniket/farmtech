import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';
import cross_icon2 from '../../assets/cross_2.png';
import Wheat from '../../assets/wheat.png';
import Rice from '../../assets/rice.png';

// Dummy product list for fallback
const dummyProducts = [
  { _id: 'DUMMY001', name: 'Wheat', price: 250, type: 'Grain', image: Wheat },
  { _id: 'DUMMY002', name: 'Rice', price: 300, type: 'Cereal', image: Rice },
  { _id: 'DUMMY003', name: 'Corn', price: 180, type: 'Vegetable', image: '/assets/corn.png' },
];

export const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('x-access-token');

  // Fetch products from the API
  const fetchInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://farmtech-kxq6.onrender.com/api/farmers/getproducts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // Check if the response is an array of products
      if (Array.isArray(data) && data.length > 0) {
        setAllProducts(data);
        setError(null);
      } else if (Array.isArray(data) && data.length === 0) {
        setAllProducts([]);
        setError(null);
      } else {
        throw new Error('Invalid response format: expected an array');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Showing dummy data.');
      setAllProducts(dummyProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line
  }, []);

  // Remove product using the endpoint
  const removeProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;

    // If the product is from dummy data, simply filter it out
    if (allProducts.some((p) => p._id.startsWith('DUMMY'))) {
      setAllProducts((prev) => prev.filter((p) => p._id !== productId));
      return;
    }

    try {
      const response = await fetch(`https://farmtech-kxq6.onrender.com/api/farmers/deleteproduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Use a more subtle notification instead of alert
        const notification = document.createElement('div');
        notification.className = 'product-notification success';
        notification.textContent = data.message || 'Product removed successfully';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
        
        await fetchInfo(); // Refresh the product list
      } else {
        const notification = document.createElement('div');
        notification.className = 'product-notification error';
        notification.textContent = 'Failed to remove product: ' + (data.message || 'Unknown error');
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }
    } catch (err) {
      console.error('Error removing product:', err);
      const notification = document.createElement('div');
      notification.className = 'product-notification error';
      notification.textContent = 'An error occurred while removing the product';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  // Function to render product category with badge styling
  const renderCategory = (type) => {
    const categoryColors = {
      'Grain': 'badge-grain',
      'Cereal': 'badge-cereal',
      'Vegetable': 'badge-vegetable',
      'Fruit': 'badge-fruit',
      'Dairy': 'badge-dairy',
    };
    
    const badgeClass = categoryColors[type] || 'badge-default';
    
    return (
      <span className={`category-badge ${badgeClass}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="list-product">
      <div className="list-product-header">
        <h1>Your Product List</h1>
        <div className="product-count">
          {allProducts.length} {allProducts.length === 1 ? 'Product' : 'Products'}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {/* Header Row */}
          <div className="listproduct-format-main">
            <p>Product</p>
            <p>Title</p>
            <p>Price</p>
            <p>Category</p>
            <p>Actions</p>
          </div>

          <div className="listproduct-allproducts">
            {error && <p className="error-message">{error}</p>}

            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={
                        product.image && product.image.startsWith('http')
                          ? product.image
                          : product.image
                          ? `https://farmtech-kxq6.onrender.com${product.image}`
                          : 'https://via.placeholder.com/70'
                      }
                      alt={product.name}
                      className="listproduct-product-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/70?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">₹{product.price}</div>
                  <div className="product-category">
                    {renderCategory(product.type)}
                  </div>
                  <div className="product-actions">
                    <button 
                      className="remove-btn"
                      onClick={() => removeProduct(product._id)}
                      title="Remove Product"
                    >
                      <img
                        src={cross_icon2}
                        alt="Remove"
                        className="listproduct-remove-icon"
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🌱</div>
                <p className="empty-title">No products available</p>
                <p className="empty-subtitle">Add your first product to get started</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};