import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiTrash2, FiRefreshCw, FiEye, FiShield } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [pendingItems, setPendingItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [adminRevenue, setAdminRevenue] = useState(null);

  useEffect(() => {
    fetchPendingItems();
    fetchAllItems();
    fetchAdminRevenue();
  }, []);

  const fetchPendingItems = async () => {
    try {
      const response = await axios.get('/api/admin/pending-items');
      setPendingItems(response.data);
    } catch (error) {
      console.error('Error fetching pending items:', error);
      toast.error('Failed to load pending items');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      const response = await axios.get('/api/items');
      setAllItems(response.data);
    } catch (error) {
      console.error('Error fetching all items:', error);
    }
  };

  const fetchAdminRevenue = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setAdminRevenue(response.data.points);
    } catch (error) {
      setAdminRevenue(null);
    }
  };

  const handleStatusUpdate = async (itemId, status) => {
    setActionLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      await axios.put(`/api/admin/items/${itemId}/status`, { status });
      toast.success(`Item ${status} successfully`);
      await fetchPendingItems();
      await fetchAllItems();
    } catch (error) {
      console.error('Error updating item status:', error);
      toast.error('Failed to update item status');
    } finally {
      setActionLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item? This action cannot be undone.')) {
      return;
    }
    setActionLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      await axios.delete(`/api/admin/items/${itemId}`);
      toast.success('Item removed successfully');
      await fetchPendingItems();
      await fetchAllItems();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setActionLoading(prev => ({ ...prev, [itemId]: false }));
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

  // Calculate today's date string
  const today = new Date().toLocaleDateString();
  const approvedToday = allItems.filter(
    item => item.status === 'approved' && new Date(item.updatedAt).toLocaleDateString() === today
  ).length;
  const rejectedToday = allItems.filter(
    item => item.status === 'rejected' && new Date(item.updatedAt).toLocaleDateString() === today
  ).length;

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiShield className="w-5 h-5 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <p className="text-gray-600">
              Moderate and manage item listings from the community
            </p>
            {adminRevenue !== null && (
              <div className="mt-4">
                <span className="text-lg font-semibold text-green-700">Admin Revenue: {adminRevenue} pts</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {pendingItems.length}
                </div>
                <div className="text-sm text-gray-600">Pending Items</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {approvedToday}
                </div>
                <div className="text-sm text-gray-600">Approved Today</div>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {rejectedToday}
                </div>
                <div className="text-sm text-gray-600">Rejected Today</div>
              </div>
            </div>
          </div>

          {/* Pending Items */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pending Items</h2>
              <button
                onClick={fetchPendingItems}
                className="btn btn-sm btn-outline"
              >
                <FiRefreshCw />
                Refresh
              </button>
            </div>
            <div className="card-body">
              {pendingItems.length === 0 ? (
                <div className="text-center py-12">
                  <FiShield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending items
                  </h3>
                  <p className="text-gray-500">
                    All items have been reviewed and processed
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingItems.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image */}
                        <div className="lg:col-span-1">
                          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            {item.images.length > 0 ? (
                              <img
                                src={`/uploads/${item.images[0]}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{item.category}</span>
                                <span>•</span>
                                <span>{item.type}</span>
                                <span>•</span>
                                <span>{item.size}</span>
                                <span>•</span>
                                <span className={`${getStatusBadge(item.status)}`}>
                                  {item.condition}
                                </span>
                              </div>
                            </div>
                            <span className={`badge ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {item.description}
                          </p>

                          {item.tags && item.tags.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Listed on {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(item._id, 'approved')}
                                disabled={actionLoading[item._id]}
                                className="btn btn-sm btn-success"
                              >
                                {actionLoading[item._id] ? (
                                  <div className="spinner w-4 h-4"></div>
                                ) : (
                                  <>
                                    <FiCheck />
                                    Approve
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleStatusUpdate(item._id, 'rejected')}
                                disabled={actionLoading[item._id]}
                                className="btn btn-sm btn-danger"
                              >
                                {actionLoading[item._id] ? (
                                  <div className="spinner w-4 h-4"></div>
                                ) : (
                                  <>
                                    <FiX />
                                    Reject
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                disabled={actionLoading[item._id]}
                                className="btn btn-sm btn-outline"
                              >
                                {actionLoading[item._id] ? (
                                  <div className="spinner w-4 h-4"></div>
                                ) : (
                                  <>
                                    <FiTrash2 />
                                    Remove
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-8 card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Moderation Guidelines</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Approve if:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Item is in good condition</li>
                    <li>• Description is accurate and detailed</li>
                    <li>• Images are clear and appropriate</li>
                    <li>• Item follows community guidelines</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Reject if:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Item is damaged or in poor condition</li>
                    <li>• Description is misleading or incomplete</li>
                    <li>• Images are inappropriate or unclear</li>
                    <li>• Item violates community guidelines</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel; 