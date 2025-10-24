const mongoose = require('mongoose');

const wasteRecordSchema = new mongoose.Schema(
  {
    wasteId: {
      type: String,
      unique: true,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    items: [
      {
        itemName: String,
        quantity: Number,
        unit: String,
        colorCode: {
          type: String,
          enum: ['Yellow', 'Red', 'Blue', 'White'],
        },
      },
    ],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    department: {
      type: String,
      required: true,
    },
    collectedBy: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Collected', 'Dispatched'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WasteRecord', wasteRecordSchema);

