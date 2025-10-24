const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    chemicalName: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturer: {
      type: String,
    },
    batchNumber: {
      type: String,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add index for expiry date for efficient querying
medicineSchema.index({ expiryDate: 1 });

// Pre-save hook to check if medicine is expired
medicineSchema.pre('save', function(next) {
  this.isExpired = new Date() > this.expiryDate;
  next();
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = { Medicine };

