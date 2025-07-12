import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-card"
      >
        <div className="text-center">
          <div className="logo-circle">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-600">Sign in to your ReWear account</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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

          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-green-600 hover:text-green-500 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a> and{' '}
            <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
