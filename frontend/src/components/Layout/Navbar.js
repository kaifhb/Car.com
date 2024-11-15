// src/components/Layout/Navbar.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Car Display</h1>
      <ul className="navbar-links">
        {auth.isAuthenticated ? (
          <>
            <li>
              <Link to="/cars" className="navbar-link">
                My Cars
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="navbar-link">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
