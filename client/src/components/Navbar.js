import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiLogOut, FiShield, FiHome, FiGrid, FiPlus, FiAward } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100' 
        : 'bg-white shadow-lg border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-xl">
                <span className="text-white font-extrabold text-2xl tracking-tight">R</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                ReWear
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">Sustainable Fashion</span>
            </div>
          </Link>

          {/* Navigation Links - Always Horizontal */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
            >
              <FiHome className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link 
              to="/items" 
              className={`nav-link ${isActive('/items') ? 'nav-link-active' : ''}`}
            >
              <FiGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span>
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
                >
                  <FiAward className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link 
                  to="/add-item" 
                  className={`nav-link ${isActive('/add-item') ? 'nav-link-active' : ''}`}
                >
                  <FiPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">List Item</span>
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActive('/admin') ? 'nav-link-active' : ''}`}
                  >
                    <FiShield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2 lg:space-x-4 ml-2 lg:ml-6">
                  <div className="flex items-center space-x-2 lg:space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 px-2 lg:px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FiUser className="text-white w-3 h-3 lg:w-4 lg:h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-semibold text-xs lg:text-sm">{user.name}</span>
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-1 lg:px-2 py-0.5 rounded-full text-xs font-bold">
                        {user.points} pts
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 lg:space-x-2 text-gray-500 hover:text-red-500 font-medium transition-all duration-300 hover:bg-red-50 px-2 lg:px-3 py-2 rounded-lg"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link to="/login" className="nav-link">
                  <FiUser className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 