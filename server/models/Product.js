import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  startingBid: {
    type: Number,
    required: [true, 'Starting bid is required'],
    min: [1, 'Starting bid must be at least 1 NRs']
  },
  currentBid: {
    type: Number,
    default: function() {
      return this.startingBid;
    }
  },
  auctionEndTime: {
    type: Date,
    required: [true, 'Auction end time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Auction end time must be in the future'
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
productSchema.index({ seller: 1, isActive: 1 });
productSchema.index({ isActive: 1, auctionEndTime: 1 });

// Virtual for time remaining
productSchema.virtual('timeRemaining').get(function() {
  if (!this.isActive || this.auctionEndTime < new Date()) {
    return 0;
  }
  return Math.max(0, this.auctionEndTime.getTime() - new Date().getTime());
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);