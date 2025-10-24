const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    labTechnicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTechnician',
    },
    testName: {
      type: String,
      required: true,
    },
    sampleType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    estimatedTime: {
      type: String,
    },
    result: {
      type: String,
    },
    resultDate: {
      type: Date,
    },
    uploadedFile: {
      name: String,
      type: String,
      size: Number,
      uploadedAt: Date,
      data: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const LabTest = mongoose.model('LabTest', labTestSchema);

module.exports = { LabTest };

