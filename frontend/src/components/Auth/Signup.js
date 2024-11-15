// src/components/Auth/Signup.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Import the CSS file

const Signup = () => {
  const { signup, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    const { username, password } = userData;
    const result = await signup({ username, password });
    if (result.success) {
      navigate('/cars'); // Redirect to car list or dashboard
    } else {
      setErrorMessage(result.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/cars');
    }
  }, [navigate]);

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        {auth.error && <p className="error-message">{auth.error}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={auth.loading}>
            {auth.loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
