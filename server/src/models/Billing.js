const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
  },
  medicineName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  },
  route: String,
  dose: String,
  frequency: String,
});

const billingSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      unique: true,
      required: true,
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
    items: [billItemSchema],
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
      enum: ['draft', 'completed', 'cancelled'],
      default: 'draft',
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
billingSchema.index({ patientId: 1, createdAt: -1 });
billingSchema.index({ pharmacistId: 1, createdAt: -1 });
billingSchema.index({ billNumber: 1 });
billingSchema.index({ createdAt: -1 });

// Pre-save hook to calculate totals
billingSchema.pre('save', function (next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Calculate discount amount
  if (this.discountPercentage > 0) {
    this.discount = (this.subtotal * this.discountPercentage) / 100;
  }

  // Calculate tax on subtotal after discount
  const taxableAmount = this.subtotal - this.discount;
  if (this.taxPercentage > 0) {
    this.tax = (taxableAmount * this.taxPercentage) / 100;
  }

  // Calculate total amount
  this.totalAmount = taxableAmount + this.tax;

  next();
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = { Billing };

