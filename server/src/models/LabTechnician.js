const mongoose = require('mongoose');

const labTechnicianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
    },
    licenseNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const LabTechnician = mongoose.model('LabTechnician', labTechnicianSchema);

module.exports = { LabTechnician };

