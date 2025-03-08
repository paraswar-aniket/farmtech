import React, { useState, useEffect } from 'react';
import './Transactions.css';

export const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy orders fallback (Matching API structure)
  const dummyOrders = [
    {
      _id: 'DUMMY001',
      createdAt: new Date().toISOString(),
      totalBill: 500,
      customer: { name: 'John Doe' },
      products: [{ name: 'Wheat' }],
    },
    {
      _id: 'DUMMY002',
      createdAt: new Date().toISOString(),
      totalBill: 800,
      customer: { name: 'Alice Smith' },
      products: [{ name: 'Rice' }],
    },
    {
      _id: 'DUMMY003',
      createdAt: new Date().toISOString(),
      totalBill: 1200,
      customer: { name: 'Bob Johnson' },
      products: [{ name: 'Corn' }],
    },
  ];

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('x-access-token');
      const response = await fetch('https://farmtech-kxq6.onrender.com/api/farmers/getOrders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      setOrders(dummyOrders); // Use dummy data on failure
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
                    <strong>Buyer:</strong> {order.customer?.name || 'Unknown'}
                  </p>
                  <p>
                    <strong>Product(s):</strong> {productNames || 'N/A'}
                  </p>
                  <p>
                    <strong>Total Bill:</strong> ₹ {order.totalBill}
                  </p>
                </div>
                <div className="transaction-footer">
                  <span className="transaction-status">✔ Accepted</span>
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
