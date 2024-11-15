// src/components/Auth/Login.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const { login, auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials);
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
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {auth.error && <p className="error-message">{auth.error}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={auth.loading}>
            {auth.loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
