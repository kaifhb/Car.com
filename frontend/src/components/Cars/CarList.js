// src/components/Cars/CarList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CarList.css'; // Import the CSS file

/**
 * CarList Component
 * Fetches and displays a list of cars for the authenticated user.
 * Includes search functionality to filter cars based on title, description, or tags.
 */
const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'https://car-backend-4py7.onrender.com/api';

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/cars`, {
        params: { search: searchTerm },
      });
      setCars(response.data.cars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err.response?.data?.message || 'Failed to fetch cars.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  return (
    <div className="car-list-container">
      <h2 className="car-list-title">My Cars</h2>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search cars by title, description, or tags..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="h" className="search-button">
          Search
        </button>
      </form>

      {/* Link to Add New Car */}
      <div className="add-car-link">
        <Link to="/cars/new" className="add-car-button">Add New Car</Link>
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading cars...</p>}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Cars List */}
      {!loading && !error && cars.length === 0 && <p>No cars found.</p>}

      {!loading && !error && cars.length > 0 && (
        <ul className="car-list">
          {cars.map((car) => (
            <li key={car._id} className="car-list-item">
              <Link to={`/cars/${car._id}`} className="car-link">
                <h3>{car.title}</h3>
                <p>{car.description.substring(0, 100)}...</p>
                <p>
                  <strong>Tags:</strong> {car.tags.join(', ')}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarList;
