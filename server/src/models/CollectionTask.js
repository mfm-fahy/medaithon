const mongoose = require('mongoose');

const collectionTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      unique: true,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ['Morning', 'Evening'],
      required: true,
    },
    assignedStaff: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    completedAt: {
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

module.exports = mongoose.model('CollectionTask', collectionTaskSchema);

