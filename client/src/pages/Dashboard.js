import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiPackage, FiRefreshCw, FiCheck, FiX, FiClock } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [itemsResponse, swapsResponse] = await Promise.all([
        axios.get('/api/user/items'),
        axios.get('/api/user/swaps')
      ]);
      
      setUserItems(itemsResponse.data);
      setUserSwaps(swapsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      completed: 'badge-info'
    };
    return badges[status] || 'badge-info';
  };

  const getSwapStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      accepted: 'badge-success',
      rejected: 'badge-danger',
      completed: 'badge-info'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Manage your items, track your swaps, and explore sustainable fashion
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Points Balance</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">{user.points}</span>
                      <span className="text-sm text-gray-500">points</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card"
            >
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/add-item" className="btn btn-primary w-full">
                    <FiPlus />
                    List New Item
                  </Link>
                  <Link to="/items" className="btn btn-outline w-full">
                    <FiPackage />
                    Browse Items
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* User Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="card-header flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
                <button
                  onClick={fetchUserData}
                  className="btn btn-sm btn-outline"
                >
                  <FiRefreshCw />
                  Refresh
                </button>
              </div>
              <div className="card-body">
                {userItems.length === 0 ? (
                  <div className="text-center py-8">
                    <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">You haven't listed any items yet</p>
                    <Link to="/add-item" className="btn btn-primary">
                      List Your First Item
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.images.length > 0 && (
                              <img
                                src={`/uploads/${item.images[0]}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {item.category} • {item.size}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`badge ${getStatusBadge(item.status)}`}>
                                {item.status}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* User Swaps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card"
            >
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">My Swaps</h2>
              </div>
              <div className="card-body">
                {userSwaps.length === 0 ? (
                  <div className="text-center py-8">
                    <FiRefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No swap requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userSwaps.map((swap) => (
                      <div key={swap.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Swap Request #{swap.id ? swap.id.slice(0, 8) : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {swap.swapType === 'points' ? 'Points Redemption' : 'Direct Swap'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(swap.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`badge ${getSwapStatusBadge(swap.status)}`}>
                              {swap.status}
                            </span>
                            {swap.status === 'pending' && (
                              <FiClock className="w-4 h-4 text-gray-400" />
                            )}
                            {swap.status === 'accepted' && (
                              <FiCheck className="w-4 h-4 text-green-500" />
                            )}
                            {swap.status === 'rejected' && (
                              <FiX className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 