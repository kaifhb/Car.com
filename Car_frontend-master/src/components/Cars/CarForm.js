// src/components/Cars/CarForm.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CarForm.css"; // Import CSS for styling

const CarForm = () => {
  const { id } = useParams(); // If editing, id will be present
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    images: [], // This will hold File objects
  });

  const [existingImages, setExistingImages] = useState([]); // For edit mode
  const [imagePreview, setImagePreview] = useState([]); // For previewing selected images
  const [error, setError] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const API_URL = "https://car-backend-4py7.onrender.com/api";
  useEffect(() => {
    if (isEditMode) {
      // Fetch existing car details to populate the form
      const fetchCar = async () => {
        try {
          const response = await axios.get(`${API_URL}/cars/${id}`);
          const car = response.data.car;
          setFormData({
            title: car.title,
            description: car.description,
            tags: car.tags.join(", "),
            images: [], // New images will be uploaded separately
          });
          setExistingImages(car.images); // Assuming images are URLs
          setImagePreview(car.images.map((url) => ({ url })));
        } catch (err) {
          console.error("Error fetching car details:", err.response.data);
          setError("Failed to load car details.");
        }
      };

      fetchCar();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For tags, ensure they are stored as a comma-separated string
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + files.length;

    if (totalImages > 10) {
      setError("You can upload a maximum of 10 images per car.");
      setIsSubmitDisabled(true);
      return;
    } else {
      setError(null);
      setIsSubmitDisabled(false);
    }

    // Update images in formData
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));

    // Generate image previews
    const newImagePreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImagePreview((prevState) => [...prevState, ...newImagePreviews]);
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      // Remove from existing images
      const updatedExistingImages = [...existingImages];
      updatedExistingImages.splice(index, 1);
      setExistingImages(updatedExistingImages);
      setImagePreview(updatedExistingImages.map((url) => ({ url })));
    } else {
      // Remove from new images
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData((prevState) => ({
        ...prevState,
        images: updatedImages,
      }));

      const updatedPreviews = [...imagePreview];
      // Revoke the object URL to free memory
      URL.revokeObjectURL(updatedPreviews[index].url);
      updatedPreviews.splice(index, 1);
      setImagePreview(updatedPreviews);

      // Re-validate the image count
      if (existingImages.length + updatedImages.length <= 10) {
        setError(null);
        setIsSubmitDisabled(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (existingImages.length + formData.images.length > 10) {
      setError("You can upload a maximum of 10 images per car.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("tags", formData.tags);
    formData.images.forEach((image) => payload.append("images", image));

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/cars/${id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${API_URL}/cars`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Redirect to Car List after successful submission
      navigate("/cars");
    } catch (err) {
      console.error("Error submitting form:", err.response.data);
      setError(err.response.data.msg || "Failed to submit the form.");
    }
  };

  return (
    <div className="car-form-container">
      <h2>{isEditMode ? "Edit Car" : "Add New Car"}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Tags Field */}
        <div className="form-group">
          <label>Tags (comma separated):</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., Sedan, Toyota, Dealer X"
            required
          />
        </div>

        {/* Image Upload Field */}
        <div className="form-group">
          <label>Images (max 10):</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={existingImages.length + formData.images.length >= 10}
          />
          <small>You can upload up to 10 images per car.</small>
        </div>

        {/* Image Previews */}
        <div className="image-preview-container">
          {/* Existing Images (in edit mode) */}
          {isEditMode &&
            existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="image-preview">
                <img
                  src={`https://car-backend-4py7.onrender.com/uploads/${url}`}
                  alt={`Car ${index}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, true)}
                >
                  Remove
                </button>
              </div>
            ))}

          {/* New Images */}
          {/* {imagePreview.map((image, index) => (
            <div key={`new-${index}`} className="image-preview">
              <img src={image.url} alt={`Preview ${index}`} />
              <button type="button" onClick={() => handleRemoveImage(index)}>
                Remove
              </button>
            </div>
          ))} */}
        </div>

        {/* Submit Button */}
        <button className="butt1" type="submit" disabled={isSubmitDisabled}>
          {isEditMode ? "Update Car" : "Add Car"}
        </button>
      </form>
    </div>
  );
};

export default CarForm;
