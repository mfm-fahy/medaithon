const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    visitType: {
      type: String,
      enum: ['new', 'follow-up'],
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    assignedDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model('Visit', visitSchema);

module.exports = { Visit };

