import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import Bid from '../models/Bid.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/bids
// @desc    Place a bid on a product
// @access  Private (Buyers only)
router.post('/', [
  authenticate,
  authorize('buyer'),
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Bid amount must be greater than 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, amount } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if auction is still active
    if (!product.isActive || product.auctionEndTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Auction has ended'
      });
    }

    // Check if bid is higher than current highest bid
    if (amount <= product.currentBid) {
      return res.status(400).json({
        success: false,
        message: `Bid must be higher than current bid of $${product.currentBid}`
      });
    }

    // Check if buyer is trying to bid on their own product
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own product'
      });
    }

    // Create the bid
    const bid = new Bid({
      product: productId,
      bidder: req.user._id,
      amount
    });

    await bid.save();

    // Update product's current bid
    product.currentBid = amount;
    await product.save();

    // Populate the bid with user info
    await bid.populate('bidder', 'name email');
    await bid.populate('product', 'name');

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: { bid }
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error placing bid'
    });
  }
});

// @route   GET /api/bids/my-bids
// @desc    Get bids placed by current user
// @access  Private (Buyers only)
router.get('/my-bids', [authenticate, authorize('buyer')], async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate('product', 'name description currentBid auctionEndTime isActive')
      .sort({ bidTime: -1 });

    res.json({
      success: true,
      data: { bids }
    });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your bids'
    });
  }
});

// @route   GET /api/bids/:productId
// @desc    Get all bids for a specific product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const bids = await Bid.find({ product: productId })
      .populate('bidder', 'name')
      .sort({ amount: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { bids }
    });
  } catch (error) {
    console.error('Get product bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bids'
    });
  }
});

export default router;