// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginSignup from './Pages/LoginSignup/LoginSignup';
import HomePage from './Pages/Homepage/HomePage';
import Admin from './Pages/Admin/Admin';
// Import other pages as needed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* This route renders your App which conditionally renders Admin or HomePage */}
      <Route path="/*" element={<App />} />

      {/* Alternatively, you can define separate routes */}
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/admin" element={<Admin />} />
      {/* Add more routes as needed */}
    </Routes>
  </BrowserRouter>
);
