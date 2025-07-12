import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiLogOut, FiMenu, FiX, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-black font-extrabold text-2xl tracking-tight">R</span>
            </div>
            <span className="text-2xl md:text-3xl font-extrabold text-black tracking-tight">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/items" className="nav-link">
              Browse
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/add-item" className="nav-link">
                  List Item
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link flex items-center gap-1">
                    <FiShield />
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4 ml-6">
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
                    <FiUser className="text-black" />
                    <span className="text-black font-semibold">{user.name}</span>
                    <span className="bg-gray-200 text-black px-2 py-1 rounded-full text-xs font-bold">
                      {user.points} pts
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-500 hover:text-black font-medium transition-colors"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black transition-colors focus:outline-none"
            >
              {isMenuOpen ? <FiX size={32} /> : <FiMenu size={32} />}
            </button>
          </div>
        </div>
        {/* Underline */}
        <div className="h-1 w-full bg-gray-200 rounded-full opacity-70 mt-[-8px] mb-2 shadow-sm" />
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t bg-white rounded-b-xl shadow-lg animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/items" 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/add-item" 
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    List Item
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="nav-link flex items-center gap-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiShield />
                      Admin
                    </Link>
                  )}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2 bg-gray-100 px-3 py-2 rounded-full shadow-sm">
                      <span className="text-black font-semibold">{user.name}</span>
                      <span className="bg-gray-200 text-black px-2 py-1 rounded-full text-xs font-bold">
                        {user.points} pts
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-500 hover:text-black font-medium transition-colors w-full"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary text-center shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Add nav-link utility
// In index.css, add:
// .nav-link { color: #64748b; font-weight: 500; font-size: 1.1rem; padding: 0.5rem 1rem; border-radius: 0.5rem; transition: background 0.18s, color 0.18s; }
// .nav-link:hover, .nav-link.active { color: var(--accent); background: #f0fdf4; }
//
export default Navbar; 