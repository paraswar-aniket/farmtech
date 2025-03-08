import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaCalendarAlt, FaTag, FaDollarSign, FaClipboardList, FaImage } from 'react-icons/fa';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

export const AddProduct = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    type: "vegetables",
    expiryDate: "",
    quantity: "",
    price: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle image selection
  const imageHandler = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Handle text/number inputs
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  // Submit form data
  const Add_Product = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    // Build FormData
    const formData = new FormData();
    formData.append('name', productDetails.name);
    formData.append('type', productDetails.type);
    formData.append('expiryDate', productDetails.expiryDate);
    formData.append('quantity', productDetails.quantity);
    formData.append('price', productDetails.price);
    formData.append('description', productDetails.description);
    formData.append('image', image);
    
    const token = localStorage.getItem('x-access-token');
    try {
      const response = await fetch('https://farmtech-kxq6.onrender.com/api/farmers/addproduct', {
        method: 'POST',
        headers: {
          // Auth token from localStorage
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        // Adjust if your API uses a different success field
        setMessage(data.message || 'Product added successfully!');
        // Redirect to product list after 2 seconds
        setTimeout(() => {
          navigate('/listproduct');
        }, 2000);
      } else {
        // If API indicates an error
        setError(data.error || data.message || 'Failed to add product');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred: ' + err.message);
    }
  };

  return (
    <div className='addproduct-container'>
      {/* Loading overlay if request is in progress */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className='addproduct'>
        <h2>Add New Product</h2>
        <div className='addproduct-form'>
          {/* First column */}
          <div className='form-column'>
            {/* Product Name */}
            <div className='addproduct-itemfield'>
              <FaBox className='icon' />
              <input
                value={productDetails.name}
                onChange={changeHandler}
                type="text"
                name="name"
                placeholder="Product Name"
                disabled={loading}
              />
            </div>

            {/* Product Type */}
            <div className='addproduct-itemfield'>
              <FaClipboardList className='icon' />
              <select
                value={productDetails.type}
                onChange={changeHandler}
                name="type"
                disabled={loading}
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
              </select>
            </div>

            {/* Expiry Date */}
            <div className='addproduct-itemfield'>
              <FaCalendarAlt className='icon' />
              <input
                value={productDetails.expiryDate}
                onChange={changeHandler}
                type="date"
                name="expiryDate"
                disabled={loading}
              />
            </div>
          </div>

          {/* Second column */}
          <div className='form-column'>
            {/* Quantity */}
            <div className='addproduct-itemfield'>
              <FaTag className='icon' />
              <input
                value={productDetails.quantity}
                onChange={changeHandler}
                type="number"
                name="quantity"
                placeholder="Quantity"
                disabled={loading}
              />
            </div>

            {/* Price */}
            <div className='addproduct-itemfield'>
              <FaDollarSign className='icon' />
              <input
                value={productDetails.price}
                onChange={changeHandler}
                type="number"
                name="price"
                placeholder="Price"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className='addproduct-itemfield'>
              <FaClipboardList className='icon' />
              <textarea
                value={productDetails.description}
                onChange={changeHandler}
                name="description"
                placeholder="Description"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className='addproduct-itemfield-file'>
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className='addproduct-thumbnail-img'
              alt="Thumbnail"
            />
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name="image"
            id="file-input"
            hidden
            disabled={loading}
          />
        </div>

        {/* Error / Success Messages */}
        {error && <div className='error-message'>{error}</div>}
        {message && <div className='success-message'>{message}</div>}

        {/* Submit Button */}
        <button
          onClick={Add_Product}
          className='addproduct-btn'
          disabled={loading}
        >
          {loading ? 'Adding...' : 'ADD PRODUCT'}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;