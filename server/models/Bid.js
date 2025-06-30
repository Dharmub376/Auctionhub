import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [0.01, 'Bid amount must be greater than 0']
  },
  bidTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
bidSchema.index({ product: 1, amount: -1 });
bidSchema.index({ bidder: 1, bidTime: -1 });

export default mongoose.model('Bid', bidSchema);