// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  // State to hold the authentication status and user data
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true, // To handle the initial loading state
    error: null,
  });

  // Base URL for your API
  const API_URL = 'https://car-backend-4py7.onrender.com/api'; // Replace with your actual API URL

  // Effect to load user from localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setAuth({
        isAuthenticated: true,
        user: user,
        token: token,
        loading: false,
        error: null,
      });
      // Set the token in axios headers for subsequent requests
      axios.defaults.headers.common['Authorization'] = token;
    } else {
      setAuth({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  /**
   * Function to handle user signup
   * @param {Object} userData - Contains username and password
   */
  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/signup`, userData);

      // Assuming the response contains a token and user data
      const { token, user } = response.data;
      console.log(user);
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = token;

      // Update auth state
      setAuth({
        isAuthenticated: true,
        user: user,
        token: token,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      console.error('Signup Error:', error.response.data);
      setAuth((prevState) => ({
        ...prevState,
        error: error.response.data.message || 'Signup failed',
      }));
      return { success: false, message: error.response.data.message };
    }
  };

  /**
   * Function to handle user login
   * @param {Object} credentials - Contains username and password
   */
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      // Assuming the response contains a token and user data
      const { token, user } = response.data;

      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set the token in axios headers
      axios.defaults.headers.common['Authorization'] = token;

      // Update auth state
      setAuth({
        isAuthenticated: true,
        user: user,
        token: token,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      console.error('Login Error:', error.response.data);
      setAuth((prevState) => ({
        ...prevState,
        error: error.response.data.message || 'Login failed',
      }));
      return { success: false, message: error.response.data.message };
    }
  };

  /**
   * Function to handle user logout
   */
  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Remove the token from axios headers
    delete axios.defaults.headers.common['Authorization'];

    // Update auth state
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  /**
   * Function to clear authentication errors
   */
  const clearError = () => {
    setAuth((prevState) => ({
      ...prevState,
      error: null,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        signup,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
