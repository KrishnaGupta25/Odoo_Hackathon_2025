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
      <section className="relative py-24 bg-gradient-to-br from-green-200 via-blue-100 to-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0">
            <path fill="#bbf7d0" fillOpacity="0.3" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-green-800 mb-6 drop-shadow-lg">
              Sustainable Fashion
              <span className="text-accent"> Exchange</span>
            </h1>
            <p className="text-2xl text-green-900 mb-10 max-w-3xl mx-auto font-medium">
              Join our community of eco-conscious fashion lovers. Swap, share, and discover 
              pre-loved clothing while reducing textile waste and promoting sustainable fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg shadow-lg text-lg">
                Start Swapping
                <FiArrowRight />
              </Link>
              <Link to="/items" className="btn btn-outline btn-lg text-lg">
                Browse Items
                <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="section-divider" />
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Our platform makes sustainable fashion accessible, affordable, and enjoyable for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-green-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-green-700">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" />
      {/* Featured Items Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Featured Items
            </h2>
            <p className="text-lg text-green-700">
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
                    <div key={slideIndex} className="w-full flex gap-8">
                      {featuredItems.slice(slideIndex * 3, (slideIndex + 1) * 3).map((item) => (
                        <div key={item._id} className="w-1/3">
                          <Link to={`/items/${item._id}`}>
                            <motion.div
                              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.16)' }}
                              className="card h-full transition-transform duration-300"
                            >
                              <div className="aspect-square overflow-hidden rounded-t-xl">
                                <img
                                  src={`/uploads/${item.images[0]}`}
                                  alt={item.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="card-body">
                                <h3 className="font-semibold text-green-900 mb-2">
                                  {item.title}
                                </h3>
                                <p className="text-green-700 text-sm mb-2">
                                  {item.description.substring(0, 100)}...
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-green-700">
                                    {item.category} • {item.size}
                                  </span>
                                  <span className="badge badge-success">
                                    Available
                                  </span>
                                </div>
                              </div>
                            </motion.div>
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-green-100"
              >
                <FiArrowLeft className="w-7 h-7 text-green-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow border border-green-100"
              >
                <FiArrowRight className="w-7 h-7 text-green-600" />
              </button>
              {/* Dots */}
              <div className="flex justify-center mt-8 space-x-3">
                {Array.from({ length: Math.ceil(featuredItems.length / 3) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-4 h-4 rounded-full border-2 border-green-300 transition-colors ${
                      index === currentSlide ? 'bg-green-500' : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-green-700">
              <p>No items available yet. Be the first to list an item!</p>
            </div>
          )}
          <div className="text-center mt-14">
            <Link to="/items" className="btn btn-primary btn-lg shadow-lg text-lg">
              View All Items
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
      <div className="section-divider" />
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-400 to-blue-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-2xl text-green-50 mb-8 max-w-2xl mx-auto font-medium">
            Join thousands of users who are already making a difference by choosing 
            sustainable fashion through community exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-green-600 hover:bg-gray-100 btn-lg shadow-md">
              Join ReWear Today
              <FiArrowRight />
            </Link>
            <Link to="/add-item" className="btn btn-outline border-white text-white hover:bg-white hover:text-green-600 btn-lg shadow-md">
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