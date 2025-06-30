# AuctionHub - Online Bidding Platform

A complete MERN stack online bidding and auctioning platform that allows users to buy and sell items through live auctions with real-time countdown timers and image upload functionality. All transactions are in Nepalese Rupees (NRs).

## 🏗️ Project Structure

```
online-bidding-platform/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Node.js + Express backend
├── package.json     # Root package.json for concurrent development
└── README.md        # This file
```

## ✨ Features

### 🔐 User Authentication
- **Simple Registration**: Users provide name, email, password, and role (Buyer/Seller)
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different dashboards for buyers and sellers
- **Protected Routes**: Secure access to authenticated features

### 🧑‍💼 Seller Portal
- **Product Listing**: Create auctions with product details, starting bid, and duration
- **Image Upload**: Upload multiple product images with drag-and-drop support
- **Dashboard Analytics**: View total products, active auctions, sold items, and revenue in NRs
- **Auction Management**: Track bidding activity and manage listings
- **Real-time Updates**: See bid activity as it happens

### 🧑‍💻 Buyer Portal
- **Browse Auctions**: View all active products with search and filtering
- **Image Gallery**: View product images with lightbox and thumbnail navigation
- **Live Bidding**: Place bids with real-time updates in NRs
- **Bid History**: Track your bidding activity
- **Auction Tracking**: Monitor auctions you're participating in

### ⏳ Real-time Features
- **Countdown Timers**: Live countdown for each auction
- **Automatic Closure**: Bidding disabled when timer expires
- **Real-time Updates**: Instant bid updates across the platform
- **Visual Feedback**: Color-coded timers based on time remaining

### 📸 Image Management
- **Multiple Image Upload**: Support for up to 5 images per product
- **Drag & Drop Interface**: Modern file upload with preview
- **Image Gallery**: Professional image viewer with lightbox
- **Cloud Storage**: Images stored securely in the cloud
- **Responsive Images**: Optimized for all screen sizes

## 🛠️ Technology Stack

### Frontend (Client)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API communication
- **Lucide React** for icons

### Backend (Server)
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Cloudinary** for image storage (optional)
- **express-validator** for input validation
- **CORS** enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Cloudinary account (optional, for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-bidding-platform
   ```

2. **Install dependencies for all projects**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/auctionDB
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   NODE_ENV=development

   # Cloudinary Configuration (Optional - for image uploads)
   # Sign up at https://cloudinary.com for free image hosting
   # CLOUDINARY_CLOUD_NAME=your_cloud_name
   # CLOUDINARY_API_KEY=your_api_key
   # CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Ensure MongoDB is running on your system
   - **MongoDB Atlas**: Use your Atlas connection string in `MONGO_URI`

5. **Run the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start them separately:
   npm run client    # Frontend only (http://localhost:5173)
   npm run server    # Backend only (http://localhost:5000)
   ```

### Individual Setup

#### Backend Setup (Server)
```bash
cd server
npm install
# Create .env file with the variables shown above
npm run dev
```

#### Frontend Setup (Client)
```bash
cd client
npm install
npm run dev
```

## 📊 MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. The application will create the database and collections automatically

### MongoDB Atlas (Cloud)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGO_URI` in the `.env` file with your Atlas connection string

## ☁️ Cloudinary Setup (Optional)

For image upload functionality:

1. **Create a Cloudinary Account**
   - Sign up at [https://cloudinary.com](https://cloudinary.com)
   - Free tier includes 25GB storage and 25GB bandwidth

2. **Get Your Credentials**
   - Go to your Cloudinary Dashboard
   - Copy your Cloud Name, API Key, and API Secret

3. **Update Environment Variables**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

**Note**: If you don't set up Cloudinary, the image upload feature will not work, but the rest of the application will function normally.

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all active products
- `POST /api/products` - Create new product with images (Sellers only)
- `GET /api/products/my-products` - Get seller's products
- `GET /api/products/:id` - Get single product with bid history
- `DELETE /api/products/:id/image/:imageId` - Delete product image

### Bids
- `POST /api/bids` - Place a bid (Buyers only)
- `GET /api/bids/my-bids` - Get user's bid history
- `GET /api/bids/:productId` - Get all bids for a product

## 🎯 How It Works

### For Buyers
1. **Register/Login** as a buyer
2. **Browse Products** on the buyer dashboard with image galleries
3. **View Details** of interesting auctions with full image viewer
4. **Place Bids** in NRs before the countdown expires
5. **Track Your Bids** and auction results

### For Sellers
1. **Register/Login** as a seller
2. **List Products** with details, images, and auction duration
3. **Upload Images** using drag-and-drop interface
4. **Monitor Performance** through dashboard analytics in NRs
5. **Track Bidding** activity on your products
6. **Manage Auctions** and view final results

### Authentication Flow
1. Users register with basic information and role selection
2. JWT tokens are issued upon successful authentication
3. Tokens are stored in localStorage and sent with API requests
4. Role-based access controls restrict certain actions
5. Automatic token refresh and logout on expiration

### Bidding Process
1. Buyers can only bid on active auctions
2. Bids must be higher than the current highest bid
3. All amounts are displayed in Nepalese Rupees (NRs)
4. Real-time countdown timers show remaining time
5. Bidding is automatically disabled when time expires
6. Highest bidder wins the auction

### Image Upload Process
1. Sellers can upload up to 5 images per product
2. Drag-and-drop interface with instant preview
3. Images are automatically optimized and stored
4. Buyers can view images in a professional gallery
5. Lightbox viewer for detailed image inspection

## 💰 Currency Information

- **Primary Currency**: Nepalese Rupees (NRs)
- **Display Format**: NRs 1,000 (comma-separated for readability)
- **Minimum Bid**: 1 NRs
- **Bid Increments**: Minimum 1 NRs above current bid

## 🎨 UI Features

- **Responsive Design**: Works on all device sizes
- **Modern Aesthetics**: Glass morphism and gradient effects
- **Image Galleries**: Professional product image viewers
- **Real-time Feedback**: Visual updates for bids and timers
- **Intuitive Navigation**: Role-based dashboards
- **Professional Styling**: Production-ready interface
- **Drag & Drop**: Modern file upload interface

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Image type validation and size limits
- **CORS Configuration**: Proper cross-origin setup
- **Role-based Access**: Endpoint protection by user role
- **Error Handling**: Comprehensive error responses

## 📝 Development Notes

- **Modular Architecture**: Clean separation of concerns
- **TypeScript**: Full type safety on frontend
- **MongoDB Indexes**: Optimized queries for performance
- **Error Boundaries**: Graceful error handling
- **Form Validation**: Both client and server-side validation
- **Image Optimization**: Automatic image processing
- **Responsive Images**: Optimized for all screen sizes

## 🚢 Deployment

### Frontend (Client)
```bash
cd client
npm run build
# Deploy the `dist` folder to your hosting service
```

### Backend (Server)
- Deploy to services like Heroku, AWS, or DigitalOcean
- Set environment variables in production
- Ensure MongoDB connection is configured for production
- Configure Cloudinary for production image storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Include error messages and screenshots if applicable

---

**Happy Bidding in NRs! 🎉**