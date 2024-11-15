// src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * PrivateRoute component to protect routes that require authentication
 * @param {Object} props - Props passed to the component
 * @returns {JSX.Element}
 */
const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth.loading) {
    // Optionally, render a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
