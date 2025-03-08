import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CSS/Product.css'; // Import CSS for styling

export const Product = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]); // To store cart items

  useEffect(() => {
    // Fetch product details by ID
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('x-access-token'); // Get token before fetch
        const response = await fetch(`https://farmtech-kxq6.onrender.com/api/customer/products/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Corrected placement
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging

        setProduct(data.product); // Extracting the 'product' object correctly
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("x-access-token");
  
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }
  
    try {
      const response = await fetch(
        "https://farmtech-kxq6.onrender.com/api/customer/addtocart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id }),
        }
      );
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging log
  
      if (data.success) { // ✅ Change from 'data.result' to 'data.success'
        alert(data.message || "Product added to cart successfully.");
        setCartItems(data.cart); // ✅ Update cart with received cart items
      } else {
        alert(data.error || "Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  
  

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-details">
      {/* Left side: Product Details */}
      <div className="product-details-left">
        <img src={product.image} alt={product.name} className="product-details-image" />
        <h1 className="product-details-name">{product.name}</h1>
        <p className="product-details-type"><strong>Type:</strong> {product.type}</p>
        <p className="product-details-expiry"><strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
        <p className="product-details-quantity"><strong>Quantity:</strong> {product.quantity}</p>
        <p className="product-details-price"><strong>Price:</strong> ₹{product.price}</p>
        <p className="product-details-description"><strong>Description:</strong> {product.description}</p>
      </div>

      {/* Right side: Add to Cart */}
      <div className="product-details-right">
        <div className="quantity-section">
          <input type="number" defaultValue={1} min={1} />
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Product;
