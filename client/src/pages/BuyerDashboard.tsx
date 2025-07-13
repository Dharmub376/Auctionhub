import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Eye, Clock } from 'lucide-react';
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
  createdAt?: string;
}

const BuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.currentBid - b.currentBid;
        case 'price-high':
          return b.currentBid - a.currentBid;
        case 'ending-soon':
          return new Date(a.auctionEndTime).getTime() - new Date(b.auctionEndTime).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Auctions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Browse through amazing items and place your bids to win
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full md:w-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="w-full md:w-auto flex items-center space-x-2">
              <div className="hidden sm:block">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="ending-soon">Ending Soon</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {searchTerm ? 'No matching auctions found' : 'No active auctions'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Check back later for new auction items.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                {/* Product Image - Square Ratio */}
                <div className="aspect-square w-full overflow-hidden">
                  <ProductImageGallery
                    images={product.images}
                    productName={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.isActive && new Date(product.auctionEndTime) > new Date() ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Ended
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Current Bid:</span>
                      <span className="text-lg font-bold text-green-600">
                        NPR {formatCurrency(product.currentBid)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Time Left:</span>
                      <CountdownTimer 
                        endTime={product.auctionEndTime}
                        className="text-sm font-medium text-gray-900"
                      />
                    </div>

                    <div className="pt-3 border-t border-gray-200 mt-3">
                      <p className="text-xs text-gray-500 mb-3">
                        Sold by: <span className="font-medium">{product.seller.name}</span>
                      </p>
                      
                      <Link
                        to={`/product/${product._id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details & Bid
                      </Link>
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

export default BuyerDashboard;