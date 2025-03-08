import React, { useState, useEffect } from 'react';
import './Transactions.css';

export const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy orders fallback
  const dummyOrders = [
    {
      _id: 'DUMMY001',
      createdAt: new Date().toISOString(),
      totalBill: 500,
      customer: { name: 'John Doe' },
      products: [{ name: 'Wheat' }],
      quantity: 10,
      price: 200,
    },
    {
      _id: 'DUMMY002',
      createdAt: new Date().toISOString(),
      totalBill: 800,
      customer: { name: 'Alice Smith' },
      products: [{ name: 'Rice' }],
      quantity: 15,
      price: 300,
    },
    {
      _id: 'DUMMY003',
      createdAt: new Date().toISOString(),
      totalBill: 1200,
      customer: { name: 'Bob Johnson' },
      products: [{ name: 'Corn' }],
      quantity: 20,
      price: 400,
    },
  ];

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://farmtech-kxq6.onrender.com/api/farmers/getOrders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Pass token as a Bearer token if that's what your API expects
          'x-access-token': localStorage.getItem('x-access-token'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          throw new Error('No orders found');
        }
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Showing dummy data.');
      setOrders(dummyOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="transactions-container">
      <h1>Your Transactions</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="loading">Loading transactions...</p>
      ) : (
        <div className="transaction-cards">
          {orders.map((order) => {
            const productNames = order.products.map((p) => p.name).join(', ');
            return (
              <div key={order._id} className="transaction-card">
                <div className="transaction-header">
                  <span className="transaction-id">Txn ID: {order._id}</span>
                  <span className="transaction-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="transaction-body">
                  <p>
                    <strong>Buyer:</strong> {order.customer.name}
                  </p>
                  <p>
                    <strong>Product(s):</strong> {productNames}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹ {order.price}
                  </p>
                </div>
                <div className="transaction-footer">
                  <span className="transaction-status">✔ Accepted</span>
                  <span className="total-bill">Total: ₹ {order.totalBill}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Transactions;
