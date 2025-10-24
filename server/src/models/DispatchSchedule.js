const mongoose = require('mongoose');

const dispatchScheduleSchema = new mongoose.Schema(
  {
    dispatchId: {
      type: String,
      unique: true,
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    weekEndDate: {
      type: Date,
      required: true,
    },
    dispatchDate: {
      type: Date,
      required: true,
    },
    processingPlant: {
      type: String,
      required: true,
    },
    plantLocation: {
      type: String,
      required: true,
    },
    totalWasteQuantity: {
      type: Number,
      default: 0,
    },
    wasteBreakdown: {
      yellow: { type: Number, default: 0 },
      red: { type: Number, default: 0 },
      blue: { type: Number, default: 0 },
      white: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Transit', 'Delivered', 'Completed'],
      default: 'Scheduled',
    },
    dispatchedBy: {
      type: String,
      default: null,
    },
    dispatchedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DispatchSchedule', dispatchScheduleSchema);

