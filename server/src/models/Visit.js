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
    // Array of remarks with timestamps and doctor info
    remarksHistory: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        text: String,
        doctorId: mongoose.Schema.Types.ObjectId,
        doctorName: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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

