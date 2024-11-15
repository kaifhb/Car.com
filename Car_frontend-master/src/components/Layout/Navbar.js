import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu, X, Car, LogOut, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "bg-blue-700 text-white"
            : "text-gray-300 hover:bg-blue-700 hover:text-white"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="w-4 h-4 mr-2" />
        {children}
      </Link>
    );
  };

  const NavButton = ({ onClick, children, icon: Icon }) => (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-blue-700 hover:text-white transition-colors duration-200"
    >
      <Icon className="w-4 h-4 mr-2" />
      {children}
    </button>
  );

  return (
    <nav className="bg-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 text-white font-bold text-xl hover:text-blue-200 transition-colors duration-200"
            >
              <Car className="w-6 h-6" />
              <span>Car.Com</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {auth.isAuthenticated ? (
                <>
                  <NavLink to="/cars" icon={Car}>
                    My Cars
                  </NavLink>
                  <NavButton onClick={handleLogout} icon={LogOut}>
                    Logout
                  </NavButton>
                </>
              ) : (
                <>
                  <NavLink to="/login" icon={LogIn}>
                    Login
                  </NavLink>
                  <NavLink to="/signup" icon={UserPlus}>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {auth.isAuthenticated ? (
            <>
              <NavLink to="/cars" icon={Car}>
                My Cars
              </NavLink>
              <NavButton onClick={handleLogout} icon={LogOut}>
                Logout
              </NavButton>
            </>
          ) : (
            <>
              <NavLink to="/login" icon={LogIn}>
                Login
              </NavLink>
              <NavLink to="/signup" icon={UserPlus}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
