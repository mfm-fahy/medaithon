const mongoose = require('mongoose');

const injectionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    injectionName: {
      type: String,
      required: true,
    },
    injectionType: {
      type: String,
      enum: ['IV', 'IM', 'SC', 'Intradermal', 'Other'],
      required: true,
    },
    dose: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    route: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Injection = mongoose.model('Injection', injectionSchema);

module.exports = { Injection };

