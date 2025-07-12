import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiShare2, FiUser, FiCalendar, FiTag } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swapLoading, setSwapLoading] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`/api/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async (swapType) => {
    if (!user) {
      toast.error('Please log in to request a swap');
      navigate('/login');
      return;
    }

    setSwapLoading(true);
    try {
      await axios.post('/api/swaps', {
        itemId: id,
        swapType
      });
      
      toast.success(
        swapType === 'points' 
          ? 'Points redemption request sent successfully!' 
          : 'Swap request sent successfully!'
      );
      
      // Refresh user data to update points
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to request swap';
      toast.error(errorMessage);
    } finally {
      setSwapLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  const getConditionColor = (condition) => {
    const colors = {
      'new': 'text-green-600',
      'like new': 'text-blue-600',
      'good': 'text-yellow-600',
      'fair': 'text-orange-600',
      'poor': 'text-red-600'
    };
    return colors[condition.toLowerCase()] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            <FiArrowLeft />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="btn btn-outline mb-6"
        >
          <FiArrowLeft />
          Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              {item.images.length > 0 ? (
                <img
                  src={`/uploads/${item.images[currentImageIndex]}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-green-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={`/uploads/${image}`}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <FiHeart />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <FiShare2 />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className={`badge ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
                <span className={`${getConditionColor(item.condition)} font-medium`}>
                  {item.condition}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{item.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-gray-900">{item.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Size</label>
                <p className="text-gray-900">{item.size}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Condition</label>
                <p className={`${getConditionColor(item.condition)} font-medium`}>
                  {item.condition}
                </p>
              </div>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <FiTag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Uploader Info */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Listed by Community Member</p>
                  <p className="text-sm text-gray-500">
                    Listed on {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {item.available && item.status === 'approved' && (
              <div className="space-y-4 pt-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleSwap('direct')}
                    disabled={swapLoading}
                    className="btn btn-primary flex-1"
                  >
                    {swapLoading ? (
                      <>
                        <div className="spinner w-4 h-4"></div>
                        Requesting...
                      </>
                    ) : (
                      'Request Direct Swap'
                    )}
                  </button>
                  <button
                    onClick={() => handleSwap('points')}
                    disabled={swapLoading}
                    className="btn btn-outline flex-1"
                  >
                    {swapLoading ? (
                      <>
                        <div className="spinner w-4 h-4"></div>
                        Requesting...
                      </>
                    ) : (
                      'Redeem with Points (50 pts)'
                    )}
                  </button>
                </div>
                
                {user && (
                  <div className="text-center text-sm text-gray-500">
                    Your points balance: <span className="font-medium text-green-600">{user.points} pts</span>
                  </div>
                )}
              </div>
            )}

            {!item.available && (
              <div className="text-center py-4">
                <span className="badge badge-danger">Item Not Available</span>
              </div>
            )}

            {item.status !== 'approved' && (
              <div className="text-center py-4">
                <span className="badge badge-warning">Item Pending Approval</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 