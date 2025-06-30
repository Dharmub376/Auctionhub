import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Plus, Package, DollarSign, Clock, Users, Upload } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import ImageUpload from '../components/ImageUpload';
import ProductImageGallery from '../components/ProductImageGallery';

interface Product {
  _id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  startingBid: number;
  currentBid: number;
  auctionEndTime: string;
  isActive: boolean;
  winner?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ProductForm {
  name: string;
  description: string;
  startingBid: number;
  auctionDuration: number;
}

const SellerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProductForm>();

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/my-products');
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    setIsCreating(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Submitting product data:', data);
      
      const auctionEndTime = new Date();
      auctionEndTime.setHours(auctionEndTime.getHours() + data.auctionDuration);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('startingBid', data.startingBid.toString());
      formData.append('auctionEndTime', auctionEndTime.toISOString());

      // Only append images if there are any
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formData.append('images', image);
        });
        console.log(`Uploading ${selectedImages.length} images`);
      } else {
        console.log('No images to upload');
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product created successfully:', response.data);

      reset();
      setSelectedImages([]);
      setShowCreateForm(false);
      fetchMyProducts();
      
      // Show success message
      setSuccess('Product created successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      setError(errorMessage);
      console.error('Full error response:', error.response?.data);
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 font-medium">{success}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your auctions and track performance</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>List New Product</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Auctions</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.isActive && new Date(p.auctionEndTime) > new Date()).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sold Items</p>
              <p className="text-2xl font-bold text-purple-600">
                {products.filter(p => !p.isActive && p.winner).length}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-indigo-600">
                {formatCurrency(products
                  .filter(p => p.winner)
                  .reduce((sum, p) => sum + p.currentBid, 0))}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">List New Product</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Note: Image upload requires Cloudinary configuration. You can create products without images.
                </p>
                <ImageUpload
                  images={selectedImages}
                  onImagesChange={setSelectedImages}
                  maxImages={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  {...register('name', { required: 'Product name is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe your product in detail"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Bid (NRs) *
                </label>
                <input
                  {...register('startingBid', { 
                    required: 'Starting bid is required',
                    min: { value: 1, message: 'Starting bid must be at least 1 NRs' }
                  })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter starting bid amount"
                />
                {errors.startingBid && (
                  <p className="text-red-600 text-sm mt-1">{errors.startingBid.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auction Duration *
                </label>
                <select
                  {...register('auctionDuration', { required: 'Duration is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select duration</option>
                  <option value="1">1 hour</option>
                  <option value="6">6 hours</option>
                  <option value="24">1 day</option>
                  <option value="72">3 days</option>
                  <option value="168">1 week</option>
                </select>
                {errors.auctionDuration && (
                  <p className="text-red-600 text-sm mt-1">{errors.auctionDuration.message}</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setSelectedImages([]);
                    setError('');
                    reset();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Auction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products listed</h3>
            <p className="text-gray-600 mb-4">Start by creating your first auction</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
            >
              List Your First Product
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {products.map((product) => (
              <div key={product._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <ProductImageGallery
                        images={product.images}
                        productName={product.name}
                        className="w-full lg:w-48 h-48"
                      />
                    ) : (
                      <div className="w-full lg:w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      {product.isActive && new Date(product.auctionEndTime) > new Date() ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                          Ended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Starting Bid:</span>
                        <p className="font-semibold text-gray-900">{formatCurrency(product.startingBid)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Current Bid:</span>
                        <p className="font-semibold text-green-600">{formatCurrency(product.currentBid)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Time Remaining:</span>
                        <CountdownTimer endTime={product.auctionEndTime} />
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <p className="font-semibold">
                          {product.winner ? (
                            <span className="text-green-600">Sold to {product.winner.name}</span>
                          ) : new Date(product.auctionEndTime) > new Date() ? (
                            <span className="text-blue-600">Active</span>
                          ) : (
                            <span className="text-gray-600">No bids</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;