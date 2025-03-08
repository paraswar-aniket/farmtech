import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import user icon
import './Navbar.css';
import navlogo from '../../assets/logo.png';

export const Navbar = () => {
    // State to store user details
    const [user, setUser] = useState(null);

    // Load user data from localStorage when component mounts
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Logout function to clear storage and refresh the UI
    const handleLogout = () => {
        localStorage.removeItem('x-access-token'); // Remove token
        localStorage.removeItem('user'); // Remove user data
        setUser(null);
        window.location.reload(); // Refresh UI
    };

    return (
        <div className="navbar">
            <img src={navlogo} alt="Logo" className="nav-logo" />
            
            <div className="navbar-user">
                {user ? (
                    <span className="user-name">Hi, {user.name}</span>
                ) : (
                    <span className="user-name">Welcome, Guest</span>
                )}
                <FaUserCircle className="user-icon" /> {/* User icon instead of image */}
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};
