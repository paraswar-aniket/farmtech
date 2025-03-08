import React from "react";
import { FaShoppingCart, FaTruck, FaChartLine } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  // Sample data for charts
  const salesData = [
    { month: "Jan", sales: 1.5 },
    { month: "Feb", sales: 1.2 },
    { month: "Mar", sales: 0.9 },
    { month: "Apr", sales: 1.1 },
    { month: "May", sales: 1.3 },
    { month: "Jun", sales: 1.0 },
    { month: "Jul", sales: 1.4 },
    { month: "Aug", sales: 0.8 },
    { month: "Sep", sales: 0.9 },
    { month: "Oct", sales: 1.2 }
  ];

  const profitData = [
    { month: "Jan", profitA: 8, profitB: 6 },
    { month: "Feb", profitA: 5, profitB: 3 },
    { month: "Mar", profitA: 6, profitB: 5 },
    { month: "Apr", profitA: 7, profitB: 4 },
    { month: "May", profitA: 5, profitB: 3 },
    { month: "Jun", profitA: 6, profitB: 5 },
    { month: "Jul", profitA: 8, profitB: 6 },
    { month: "Aug", profitA: 4, profitB: 2 },
    { month: "Sep", profitA: 5, profitB: 3 },
    { month: "Oct", profitA: 7, profitB: 6 }
  ];

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <FaShoppingCart className="icon red" />
          <h3>Total Orders</h3>
          <p>359</p>
        </div>
        <div className="card">
          <FaTruck className="icon blue" />
          <h3>Total Delivered</h3>
          <p>335</p>
        </div>
        <div className="card">
          <FaChartLine className="icon green" />
          <h3>Total Sales</h3>
          <p>₹ 11.8 Cr</p>
        </div>
      </div>

      {/* Sales Performance Chart */}
      <div className="chart-container">
        <h3>📊 Monthly Sales Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#ff5733" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Profit Performance Chart */}
      <div className="chart-container">
        <h3>📈 Monthly Profit Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={profitData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profitA" fill="#8884d8" />
            <Bar dataKey="profitB" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
