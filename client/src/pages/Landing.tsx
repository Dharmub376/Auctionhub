import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Users, Shield, Clock, ArrowRight, Star } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Gavel className="h-8 w-8 text-blue-600" />,
      title: 'Live Auctions',
      description: 'Participate in real-time bidding with instant updates and notifications.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Trusted Community',
      description: 'Join thousands of verified buyers and sellers in our secure marketplace.'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Secure Transactions',
      description: 'Your data and transactions are protected with enterprise-grade security.'
    },
    {
      icon: <Clock className="h-8 w-8 text-amber-600" />,
      title: 'Real-time Updates',
      description: 'Never miss a bid with live countdown timers and instant notifications.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Art Collector',
      content: 'Found amazing pieces at great prices. The platform is intuitive and secure.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Small Business Owner',
      content: 'Sold my vintage electronics collection quickly. Great seller tools!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Antique Dealer',
      content: 'Best auction platform I\'ve used. Real-time bidding works flawlessly.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AuctionHub
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The premier online marketplace for live auctions. Buy unique items or sell your treasures 
              to a global community of collectors and enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 font-semibold transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AuctionHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of online auctions with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-blue-200"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start buying or selling
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Buyers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">For Buyers</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Create Account', desc: 'Sign up as a buyer in seconds' },
                  { step: '2', title: 'Browse Auctions', desc: 'Discover amazing items from verified sellers' },
                  { step: '3', title: 'Place Bids', desc: 'Bid in real-time with live updates' },
                  { step: '4', title: 'Win & Pay', desc: 'Secure checkout for winning bids' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Sellers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-600 mb-6">For Sellers</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Create Account', desc: 'Sign up as a seller and get verified' },
                  { step: '2', title: 'List Items', desc: 'Upload photos and set auction details' },
                  { step: '3', title: 'Manage Auctions', desc: 'Track bids and manage your listings' },
                  { step: '4', title: 'Get Paid', desc: 'Receive payment after successful auction' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied buyers and sellers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Bidding?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join AuctionHub today and discover amazing deals or turn your items into cash
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Join as Buyer</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join as Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;