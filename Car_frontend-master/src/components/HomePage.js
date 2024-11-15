import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSpring, animated } from "react-spring";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const { user } = auth;
  const navigate = useNavigate();

  // Define animation using react-spring
  const props = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(-50px)" },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <animated.div
        style={props}
        className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-xl text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.username}!
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Manage your cars with ease.
        </p>
      </animated.div>

      <div className="mt-10">
        {/* Example Animation: A simple spinning wheel */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default HomePage;
