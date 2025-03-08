import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import { GoogleLogin } from '@react-oauth/google';
import { FaUser, FaMobileAlt, FaEnvelope, FaLock, FaHome } from 'react-icons/fa';

export const LoginSignup = () => {
  const [state, setState] = useState('Sign Up'); // "Sign Up" or "Login"
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log('Login Function Executed', formData);
    try {
      const response = await fetch(
        'https://farmtech-kxq6.onrender.com/api/customer/signin',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: formData.mobile,
            password: formData.password,
          }),
        }
      );
      const responseData = await response.json();

      if (response.ok && responseData.success) {
        localStorage.setItem('x-access-token', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData));
        window.location.replace('/');
      } else {
        alert(responseData.error || responseData.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Connection error. Please try again later.');
    }
  };

  const signup = async () => {
    console.log('Sign Up Function Executed', formData);
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.email ||
      !formData.password ||
      !formData.address
    ) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(
        'https://farmtech-kxq6.onrender.com/api/customer/signup',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const responseData = await response.json();

      if (response.ok && responseData.result) {
        alert('Sign up successful! Please log in.');
        setState('Login');
      } else {
        alert(responseData.error || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Connection error. Please try again later.');
    }
  };

  return (
    <div className='loginSignup'>
      <div className="loginSignup-container">
        <h1>{state}</h1>

        <div className="loginSignup-fields">
          {state === 'Sign Up' && (
            <>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={changeHandler}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={changeHandler}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="input-group">
                <FaHome className="input-icon" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={changeHandler}
                  placeholder="Your Address"
                  required
                />
              </div>
            </>
          )}

          <div className="input-group">
            <FaMobileAlt className="input-icon" />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={changeHandler}
              placeholder="Mobile Number"
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Password"
              required
              minLength="6"
            />
          </div>
        </div>

        <button className="submit-button" onClick={() => (state === 'Login' ? login() : signup())}>
          Continue
        </button>

        {state === 'Sign Up' ? (
          <p className="loginSignup-login">
            Already have an account? <span onClick={() => setState("Login")}>Login</span>
          </p>
        ) : (
          <p className="loginSignup-login">
            Create an account <span onClick={() => setState("Sign Up")}>Sign Up</span>
          </p>
        )}
      </div>
    </div>
  );
};
