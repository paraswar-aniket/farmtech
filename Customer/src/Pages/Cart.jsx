import React, { useEffect, useState } from "react";
import CartItems from "../../Components/CartItems/CartItems";
import "./CSS/Cart.css";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const token = localStorage.getItem("x-access-token");

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!token) return;

            try {
                const response = await fetch("https://farmtech-kxq6.onrender.com/api/customer/getcart", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,  // Fixed token syntax
                    },
                });

                const data = await response.json();
                if (data.success) {  
                    const updatedCart = data.cartProducts.map(item => ({
                        ...item,
                        quantity: 1, // Default quantity to 1
                    }));
                    setCartItems(updatedCart);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [token]);

    const handleRemoveItem = async (productId) => {
        try {
            const response = await fetch(`https://farmtech-kxq6.onrender.com/api/customer/removecart`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId })
            });

            const data = await response.json();
            if (data.success) {
                setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
          alert("Your cart is empty");
          return;
        }
    
        setProcessing(true);
    
        // Calculate total amount from cartItems
        const totalAmount = cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
    
        // Retrieve user details from localStorage (assuming key "user")
        const userData = localStorage.getItem("user");
        if (!userData) {
          alert("User not logged in");
          setProcessing(false);
          return;
        }
        const user = JSON.parse(userData);
        const { name, email, mobile } = user;
    
        // Prepare order request for Razorpay
        const orderRequest = {
          amount: totalAmount,
          name,
          email,
          contact: mobile,
          description: "Order Payment",
        };
    
        try {
          // Call backend to create an order for Razorpay
          const createOrderResponse = await axios.post(
            "https://farmtech-kxq6.onrender.com/api/customer/createorder",
            orderRequest,
            {
              headers: { "Authorization": `Bearer ${token}` },
            }
          );
    
          const createOrderData = createOrderResponse.data;
          if (createOrderData.success) {
            const options = {
              key: createOrderData.key_id, // Provided by backend
              amount: createOrderData.amount,
              currency: "INR",
              name: name,
              description: orderRequest.description,
              order_id: createOrderData.order_id,
              prefill: { name, email, contact: mobile },
              handler: async function (response) {
                console.log("Payment Successful:", response);
                alert("Payment Successful!");
    
                // Store the order_id in localStorage
                localStorage.setItem("order_id", createOrderData.order_id);

                console.log("Payment Successful:");
    
                // // Now call the API to place the order using the order_id
                // try {
                //   const placeOrderResponse = await axios.post(
                //     "https://farmtech-kxq6.onrender.com/api/customer/placeorder",
                //     { orderId: createOrderData.order_id },
                //     {
                //       headers: {
                //         "Authorization": `Bearer ${token}`,
                //         "Content-Type": "application/json",
                //       },
                //     }
                //   );
                //   const placeOrderData = placeOrderResponse.data;
                //   if (placeOrderData.success) {
                //     alert("Order placed successfully!");
                //     setCartItems([]); // Clear cart on success
                //   } else {
                //     alert("Order placement failed: " + placeOrderData.error);
                //   }
                // } catch (orderError) {
                //   console.error("Error placing order:", orderError);
                // }
              },
              theme: { color: "#3399cc" },
            };
    
            // Open Razorpay payment window
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            alert("Failed to create order. Please try again.");
          }
        } catch (error) {
          console.error("Error during checkout:", error);
        } finally {
          setProcessing(false);
        }
      };
    
    if (loading) {
        return <div>Loading cart items...</div>;
    }

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cartItems.map(item => (
                        <CartItems
                            key={item._id}
                            item={item}
                            onRemove={handleRemoveItem}
                            onQuantityChange={handleQuantityChange}
                        />
                    ))}
                    <div className="checkout">
                        <button onClick={handleCheckout} disabled={processing}>
                            {processing ? "Processing..." : "Checkout"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
