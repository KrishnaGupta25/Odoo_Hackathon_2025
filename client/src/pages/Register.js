import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // ✅ Fixed here
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await register(formData.name, formData.email, formData.password); // ✅ Fixed
      if (result.success) {
        toast.success("Account created successfully!");
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <div className="logo-circle">
          <span className="text-white font-bold text-xl">R</span>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the ReWear platform today
        </p>

        <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="form-label">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                className="form-input pl-10"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">Email address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="form-input pl-10"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password"
                className="form-input pl-10 pr-10"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Confirm your password"
                className="form-input pl-10 pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
            Log in
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          By signing up, you agree to our{' '}
          <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>.
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
