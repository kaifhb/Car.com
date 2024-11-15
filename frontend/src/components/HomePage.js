// src/components/HomePage.js

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSpring, animated } from 'react-spring';
import './HomePage.css'; // Import CSS for additional styling
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const { user } = auth;
  const navigate = useNavigate();

  // Define animation using react-spring
  const props = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-50px)' },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } 
  }, [navigate])


  return (
    <div className="homepage-container">
      <animated.div style={props} className="user-details">
        <h1>Welcome, {user.username}!</h1>
        <p>Manage your cars with ease.</p>
      </animated.div>
      <div className="animation-container">
        {/* Example Animation: A simple spinning wheel */}
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default HomePage;
