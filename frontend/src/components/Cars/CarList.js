import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, Plus, Loader2, Car } from "lucide-react";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://car-backend-4py7.onrender.com/api";

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/cars`, {
        params: { search: searchTerm },
      });
      setCars(response.data.cars);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(err.response?.data?.message || "Failed to fetch cars.");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Car Collections
        </h2>
        <Link
          to="/cars/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Car
        </Link>
      </div>

      {/* Search Section */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cars by title, description, or tags..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-11 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading cars...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && cars.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <Car className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-2 text-base font-medium text-gray-900">
            No cars found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new car to your collection.
          </p>
        </div>
      )}

      {/* Cars Grid */}
      {!loading && !error && cars.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cars.map((car) => (
            <Link key={car._id} to={`/cars/${car._id}`} className="group block">
              <div className="bg-white rounded-md shadow-sm hover:shadow-md transition duration-200">
                {/* Card Image */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  {car.images && car.images[0] ? (
                    <img
                      src={`https://car-backend-4py7.onrender.com/uploads/${car.images[0]}`}
                      alt={car.title}
                      className="w-full h-full object-cover rounded-t-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-md">
                      <Car className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-1">
                    {car.title}
                  </h3>
                  <p className="text-base text-gray-600 mb-3 line-clamp-2">
                    {car.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {car.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {car.tags.length > 2 && (
                      <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-50 text-gray-600">
                        +{car.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;
