import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { DollarSign, User, Clock, Gavel, TrendingUp } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
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
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  winner?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Bid {
  _id: string;
  amount: number;
  bidder: {
    _id: string;
    name: string;
  };
  bidTime: string;
}

interface BidForm {
  amount: number;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<BidForm>();

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      setValue('amount', product.currentBid + 1);
    }
  }, [product, setValue]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data.data.product);
      setBids(response.data.data.bids);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: BidForm) => {
    setBidding(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/bids', {
        productId: id,
        amount: data.amount
      });

      // Refresh product details to get updated bid
      fetchProductDetails();
      reset();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setBidding(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return <Navigate to="/buyer-dashboard" replace />;
  }

  const isAuctionActive = product.isActive && new Date(product.auctionEndTime) > new Date();
  const canBid = user?.role === 'buyer' && isAuctionActive && user._id !== product.seller._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Details - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden p-6">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              className="h-96"
            />
          </div>

          {/* Product Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {isAuctionActive ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  Active Auction
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                  Auction Ended
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-gray-600 mb-6">
              <User className="h-4 w-4" />
              <span>Sold by {product.seller.name}</span>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>

          {/* Bid History */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Bid History</span>
              </h2>
            </div>
            
            <div className="p-6">
              {bids.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bids placed yet</p>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid) => (
                    <div
                      key={bid._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {bid.bidder.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{bid.bidder.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-green-600">
                            {formatCurrency(bid.amount)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(bid.bidTime).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bidding Panel - Right Column */}
        <div className="space-y-6">
          {/* Current Bid & Timer */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Highest Bid</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-bold text-green-600">
                    {formatCurrency(product.currentBid)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500 mb-2">Time Remaining</p>
                <CountdownTimer 
                  endTime={product.auctionEndTime}
                  className="justify-center text-lg"
                />
              </div>
            </div>
          </div>

          {/* Bidding Form */}
          {canBid ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount (NRs)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      NRs
                    </span>
                    <input
                      {...register('amount', {
                        required: 'Bid amount is required',
                        min: {
                          value: product.currentBid + 1,
                          message: `Bid must be higher than ${formatCurrency(product.currentBid)}`
                        }
                      })}
                      type="number"
                      min={product.currentBid + 1}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Minimum: ${formatCurrency(product.currentBid + 1)}`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={bidding}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bidding ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Placing Bid...</span>
                    </div>
                  ) : (
                    'Place Bid'
                  )}
                </button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-xs">
                  <strong>Note:</strong> By placing a bid, you agree to purchase this item if you win the auction.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="text-center space-y-3">
                {!user ? (
                  <p className="text-gray-600">Please log in to place bids</p>
                ) : user.role !== 'buyer' ? (
                  <p className="text-gray-600">Only buyers can place bids</p>
                ) : user._id === product.seller._id ? (
                  <p className="text-gray-600">You cannot bid on your own product</p>
                ) : !isAuctionActive ? (
                  <div>
                    <p className="text-gray-600 mb-2">This auction has ended</p>
                    {product.winner && (
                      <p className="text-green-600 font-semibold">
                        Won by {product.winner.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Bidding is not available</p>
                )}
              </div>
            </div>
          )}

          {/* Auction Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Starting Bid:</span>
                <span className="font-medium">{formatCurrency(product.startingBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Bid:</span>
                <span className="font-medium text-green-600">{formatCurrency(product.currentBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Bids:</span>
                <span className="font-medium">{bids.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Auction Ends:</span>
                <span className="font-medium">
                  {new Date(product.auctionEndTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;