const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema(
  {
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Billing',
      required: true,
    },
    billNumber: {
      type: String,
      required: true,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    patientName: {
      type: String,
      required: true,
    },
    patientPhone: String,
    pharmacistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pharmacistName: String,
    items: [
      {
        medicineName: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'insurance', 'other'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    notes: String,
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'returned'],
      default: 'completed',
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
salesSchema.index({ billId: 1 });
salesSchema.index({ billNumber: 1 });
salesSchema.index({ patientId: 1, saleDate: -1 });
salesSchema.index({ pharmacistId: 1, saleDate: -1 });
salesSchema.index({ saleDate: -1 });
salesSchema.index({ paymentStatus: 1 });

const Sales = mongoose.model('Sales', salesSchema);

module.exports = { Sales };

