import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiHeart, FiUsers, FiShield } from 'react-icons/fi';
import axios from 'axios';

const LandingPage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get('/api/items');
        // Take first 6 items for featured carousel
        setFeaturedItems(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(featuredItems.length / 3)));
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(featuredItems.length / 3)));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.max(0, Math.ceil(featuredItems.length / 3) - 1) : prev - 1
    );
  };

  const features = [
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: 'Sustainable Fashion',
      description: 'Reduce textile waste by giving clothes a second life through community exchange.'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Community Driven',
      description: 'Connect with like-minded individuals who share your passion for sustainable living.'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Safe & Secure',
      description: 'All items are moderated and verified to ensure quality and authenticity.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Sustainable Fashion
              <span className="text-green-600"> Exchange</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our community of eco-conscious fashion lovers. Swap, share, and discover 
              pre-loved clothing while reducing textile waste and promoting sustainable fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Swapping
                <FiArrowRight />
              </Link>
              <Link to="/items" className="btn btn-outline btn-lg">
                Browse Items
                <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes sustainable fashion accessible, affordable, and enjoyable for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Items
            </h2>
            <p className="text-lg text-gray-600">
              Discover amazing pieces from our community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner w-8 h-8"></div>
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${Math.ceil(featuredItems.length / 3) * 100}%`
                  }}
                >
                  {Array.from({ length: Math.ceil(featuredItems.length / 3) }, (_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex gap-6">
                      {featuredItems.slice(slideIndex * 3, (slideIndex + 1) * 3).map((item) => (
                        <div key={item.id} className="w-1/3">
                          <Link to={`/items/${item.id}`}>
                            <div className="card h-full">
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={`/uploads/${item.images[0]}`}
                                  alt={item.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="card-body">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                  {item.description.substring(0, 100)}...
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-500">
                                    {item.category} • {item.size}
                                  </span>
                                  <span className="badge badge-success">
                                    Available
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <FiArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <FiArrowRight className="w-6 h-6 text-gray-600" />
              </button>

              {/* Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(featuredItems.length / 3) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No items available yet. Be the first to list an item!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/items" className="btn btn-primary btn-lg">
              View All Items
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already making a difference by choosing 
            sustainable fashion through community exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-green-600 hover:bg-gray-100 btn-lg">
              Join ReWear Today
              <FiArrowRight />
            </Link>
            <Link to="/add-item" className="btn btn-outline border-white text-white hover:bg-white hover:text-green-600 btn-lg">
              List Your First Item
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 