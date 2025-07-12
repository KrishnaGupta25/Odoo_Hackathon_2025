import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Other'
  ];

  const types = [
    'Casual', 'Formal', 'Sportswear', 'Vintage', 'Designer', 'Streetwear', 'Other'
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Custom'
  ];

  const conditions = [
    'New', 'Like New', 'Good', 'Fair', 'Poor'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          file,
          preview: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image.file);
      });

      await axios.post('/api/items', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Item submitted successfully! It will be reviewed by our team.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting item:', error);
      toast.error('Failed to submit item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              List a New Item
            </h1>
            <p className="text-gray-600">
              Share your pre-loved clothing with the community and promote sustainable fashion
            </p>
          </div>

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="form-label">Images (up to 5)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload clear, well-lit photos. Maximum 5 images, 5MB each.
                  </p>
                </div>

                {/* Title */}
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="form-input"
                    placeholder="e.g., Vintage Denim Jacket"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    className="form-input form-textarea"
                    placeholder="Describe your item in detail..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Category and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">Category *</label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="form-input"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="type" className="form-label">Type *</label>
                    <select
                      id="type"
                      name="type"
                      required
                      className="form-input"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="">Select type</option>
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Size and Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="size" className="form-label">Size *</label>
                    <select
                      id="size"
                      name="size"
                      required
                      className="form-input"
                      value={formData.size}
                      onChange={handleChange}
                    >
                      <option value="">Select size</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="condition" className="form-label">Condition *</label>
                    <select
                      id="condition"
                      name="condition"
                      required
                      className="form-input"
                      value={formData.condition}
                      onChange={handleChange}
                    >
                      <option value="">Select condition</option>
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label htmlFor="tags" className="form-label">Tags</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="form-input"
                    placeholder="e.g., sustainable, eco-friendly, vintage (separate with commas)"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add relevant tags to help others find your item
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-4 h-4"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiPlus />
                        Submit Item
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mt-8 card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Listing Guidelines</h3>
            </div>
            <div className="card-body">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Ensure all items are clean and in good condition</li>
                <li>• Provide accurate descriptions and measurements</li>
                <li>• Upload clear, well-lit photos from multiple angles</li>
                <li>• Be honest about any flaws or damage</li>
                <li>• Items will be reviewed by our team before approval</li>
                <li>• Inappropriate or spam items will be rejected</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddItem; 