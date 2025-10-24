const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      enum: ['Ventilator', 'ECG Machine', 'Infusion Pump', 'Defibrillator', 'Patient Monitor', 'Suction Apparatus', 'X-Ray Machine'],
    },
    model: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    lastServiceDate: {
      type: Date,
      default: null,
    },
    nextServiceDue: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Due Soon', 'Overdue', 'Under Maintenance', 'Inactive'],
      default: 'Active',
    },
    maintenanceHistory: [
      {
        date: Date,
        type: String,
        technician: String,
        notes: String,
        serviceReport: String,
      },
    ],
    usageHours: {
      type: Number,
      default: 0,
    },
    criticalityLevel: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'High',
    },
    qrCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);

