// src/components/NotFound.js

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound Component
 * Displays a 404 error message for undefined routes.
 */
const NotFound = () => {
  return (
    <div style={styles.container}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/cars" style={styles.homeLink}>
        Go to Car List
      </Link>
    </div>
  );
};

// Inline styles for demonstration purposes
const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
  homeLink: {
    marginTop: '1rem',
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};

export default NotFound;
