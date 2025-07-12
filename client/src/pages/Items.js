import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Items</h1>
          <p className="text-lg text-gray-600">Explore all available items from the community</p>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <div className="spinner w-8 h-8"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No items available yet. Be the first to list an item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card h-full flex flex-col"
              >
                <Link to={`/items/${item._id}`} className="flex-1 flex flex-col">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={`/uploads/${item.images[0]}`}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="card-body flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description.substring(0, 80)}...</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">{item.category} • {item.size}</span>
                      <span className="badge badge-success">Available</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Items; 