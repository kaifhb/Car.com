import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X } from "lucide-react";

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const API_URL = "https://car-backend-4py7.onrender.com/api";

  useEffect(() => {
    if (isEditMode) {
      const fetchCar = async () => {
        try {
          const response = await axios.get(`${API_URL}/cars/${id}`);
          const car = response.data.car;
          setFormData({
            title: car.title,
            description: car.description,
            tags: car.tags.join(", "),
            images: [],
          });
          setExistingImages(car.images);
          setImagePreview(car.images.map((url) => ({ url })));
        } catch (err) {
          console.error("Error fetching car details:", err.response?.data);
          setError("Failed to load car details.");
        }
      };

      fetchCar();
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));

    const newImagePreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImagePreview((prevState) => [...prevState, ...newImagePreviews]);

    // Show success toast with count of uploaded images
    setUploadMessage(
      `Successfully uploaded ${files.length} ${
        files.length === 1 ? "image" : "images"
      }`
    );
    setShowSuccessToast(true);
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      const updatedExistingImages = [...existingImages];
      updatedExistingImages.splice(index, 1);
      setExistingImages(updatedExistingImages);
      setImagePreview((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData((prevState) => ({
        ...prevState,
        images: updatedImages,
      }));

      const updatedPreviews = [...imagePreview];
      URL.revokeObjectURL(updatedPreviews[index].url);
      updatedPreviews.splice(index, 1);
      setImagePreview(updatedPreviews);

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

      navigate("/cars");
    } catch (err) {
      console.error("Error submitting form:", err.response?.data);
      setError(err.response?.data?.msg || "Failed to submit the form.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-fade-in-down z-50">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">{uploadMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Car" : "Add New Car"}
          </h2>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., Sedan, Toyota, Dealer X"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Images (max 10)
              </label>
              <div className="mt-1">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Click to upload images
                      </p>
                    </div>
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      disabled={
                        existingImages.length + formData.images.length >= 10
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You can upload up to 10 images per car.
              </p>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* New Images */}
              {imagePreview.map((preview, index) => (
                <div key={`preview-${index}`} className="relative group">
                  <img
                    src={preview.url}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${
                isSubmitDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isEditMode ? "Update Car" : "Add Car"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarForm;
