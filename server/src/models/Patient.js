const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
    },
    allergies: {
      type: [String],
      default: [],
    },
    qrCode: {
      type: String,
      default: null,
    },
    currentVisit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visit',
      default: null,
    },
    hospitalNavigation: {
      roomNumber: String,
      floor: String,
      department: String,
      directions: String,
      estimatedWaitTime: Number,
      status: {
        type: String,
        enum: ['not-scheduled', 'scheduled', 'in-progress', 'completed'],
        default: 'not-scheduled',
      },
      lastUpdated: Date,
    },
    prescribedMedicines: [
      {
        medicine: String,
        route: String,
        dose: String,
        frequency: String,
        prescribedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    injectionDetails: {
      required: Boolean,
      details: String,
      roomNumber: String,
      floor: String,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
      },
      updatedAt: Date,
    },
    labTestDetails: {
      required: Boolean,
      details: String,
      roomNumber: String,
      floor: String,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
      },
      updatedAt: Date,
    },
    diagnosis: String,
    remarks: String,
    advice: String,
    inQueue: {
      type: Boolean,
      default: false,
    },
    queuePosition: Number,
    assignedDoctor: {
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null,
      },
      doctorName: String,
      specialization: String,
      roomNumber: String,
      floor: String,
      assignedAt: Date,
    },
    symptoms: [
      {
        symptom: String,
        description: String,
        recordedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Patient };

