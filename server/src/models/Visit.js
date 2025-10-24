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
    // New fields for doctor's examination
    diagnosis: {
      type: String,
    },
    advice: {
      type: String,
    },
    remarks: {
      type: String,
    },
    vitals: {
      height: String,
      weight: String,
      temperature: String,
      bloodPressure: String,
      heartRate: String,
      respiratoryRate: String,
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model('Visit', visitSchema);

module.exports = { Visit };

