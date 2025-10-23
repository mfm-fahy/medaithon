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
    },
    manufacturer: {
      type: String,
    },
    batchNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = { Medicine };

