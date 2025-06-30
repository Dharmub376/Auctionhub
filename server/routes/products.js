import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Bid from '../models/Bid.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import cloudinary from '../config/cloudinary.js';


const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product for auction
// @access  Private (Sellers only)
router.post('/', [
  authenticate,
  authorize('seller'),
  upload.array('images', 5), // Allow up to 5 images
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10-1000 characters'),
  body('startingBid').isFloat({ min: 1 }).withMessage('Starting bid must be at least 1 NRs'),
  body('auctionEndTime').isISO8601().withMessage('Please provide a valid end time')
], async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    console.log('Files received:', req.files?.length || 0);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, startingBid, auctionEndTime } = req.body;
    
    // Validate auction end time is in the future
    const endTime = new Date(auctionEndTime);
    if (endTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Auction end time must be in the future'
      });
    }

    // Process uploaded images - only add valid images
    let images = [];
    if (req.files && req.files.length > 0) {
      try {
        // Check if Cloudinary is configured
        const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                     process.env.CLOUDINARY_API_KEY && 
                                     process.env.CLOUDINARY_API_SECRET;
        
        if (isCloudinaryConfigured) {
          // Process Cloudinary images
          images = req.files
            .filter(file => file.path && file.filename) // Only include files with valid Cloudinary data
            .map(file => ({
              url: file.path,
              publicId: file.filename
            }));
          console.log('Processed Cloudinary images:', images);
        } else {
          console.log('Cloudinary not configured - skipping image upload');
          // Don't add any images if Cloudinary isn't configured
          images = [];
        }
      } catch (imageError) {
        console.error('Image processing error:', imageError);
        // Continue without images if there's an error
        images = [];
      }
    }

    const product = new Product({
      name,
      description,
      images, // This will be an empty array if no valid images
      startingBid: parseFloat(startingBid),
      auctionEndTime: endTime,
      seller: req.user._id
    });

    console.log('Saving product:', product);
    await product.save();
    await product.populate('seller', 'name email');

    console.log('Product created successfully:', product._id);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error details:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error object:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/products
// @desc    Get all active products
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('Fetching products...');
    const { page = 1, limit = 10, active = 'true' } = req.query;
    
    const query = active === 'true' ? { isActive: true } : {};
    console.log('Query:', query);
    
    const products = await Product.find(query)
      .populate('seller', 'name email')
      .populate('winner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);
    
    console.log(`Found ${products.length} products out of ${total} total`);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
});

// @route   GET /api/products/my-products
// @desc    Get products listed by current seller
// @access  Private (Sellers only)
router.get('/my-products', [authenticate, authorize('seller')], async (req, res) => {
  try {
    console.log('Fetching products for seller:', req.user._id);
    
    const products = await Product.find({ seller: req.user._id })
      .populate('winner', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Found ${products.length} products for seller`);

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product with bid history
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('winner', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get bid history
    const bids = await Bid.find({ product: product._id })
      .populate('bidder', 'name email')
      .sort({ amount: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        product,
        bids
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching product'
    });
  }
});

// @route   DELETE /api/products/:id/image/:imageId
// @desc    Delete a product image
// @access  Private (Sellers only - own products)
router.delete('/:id/image/:imageId', [authenticate, authorize('seller')], async (req, res) => {
  try {
    const { id, imageId } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this product'
      });
    }

    // Find and remove the image
    const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const imageToDelete = product.images[imageIndex];
    
    // Delete from Cloudinary if configured
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                 process.env.CLOUDINARY_API_KEY && 
                                 process.env.CLOUDINARY_API_SECRET;
    
    if (isCloudinaryConfigured && imageToDelete.publicId) {
      try {
        await cloudinary.uploader.destroy(imageToDelete.publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }
    
    // Remove from product
    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting image'
    });
  }
});

export default router;