// src/components/Cars/CarDetail.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CarDetail.css"; // Import the CSS file

/**
 * CarDetail Component
 * Displays detailed information about a specific car.
 * Provides options to edit or delete the car.
 */
const API_URL = "https://car-backend-4py7.onrender.com/api";
const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/cars/${id}`);
        setCar(response.data.car);
      } catch (err) {
        console.error("Error fetching car details:", err);
        setError(err.response?.data?.message || "Failed to fetch car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/cars/${id}`);
      alert("Car deleted successfully.");
      navigate("/cars");
    } catch (err) {
      console.error("Error deleting car:", err);
      alert(err.response?.data?.message || "Failed to delete the car.");
    }
  };

  if (loading) {
    return <div>Loading car details...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!car) {
    return <div>No car found.</div>;
  }

  return (
    <div className="car-detail-container">
      <h2 className="car-detail-title">{car.title}</h2>
      <p className="car-detail-description">
        <strong>Description:</strong> {car.description}
      </p>
      <p className="car-detail-tags">
        <strong>Tags:</strong> {car.tags.join(", ")}
      </p>

      {/* Display Images */}
      {car.images && car.images.length > 0 ? (
        <div className="car-detail-image-container">
          {car.images.map((image, index) => (
            <img
              key={index}
              src={`https://car-backend-4py7.onrender.com/uploads/${image}`}
              alt={`Car ${index}`}
              className="car-detail-image"
            />
          ))}
        </div>
      ) : (
        <p>No images available for this car.</p>
      )}

      {/* Action Buttons */}
      <div className="button-container">
        <Link to={`/cars/${id}/edit`} className="edit-button">
          Edit
        </Link>
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>

      {/* Back to List */}
      <Link to="/cars" className="back-link">
        Back to Car List
      </Link>
    </div>
  );
};

export default CarDetail;
