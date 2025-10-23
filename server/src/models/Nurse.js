const mongoose = require('mongoose');

const nurseSchema = new mongoose.Schema(
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

const Nurse = mongoose.model('Nurse', nurseSchema);

module.exports = { Nurse };

