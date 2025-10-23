const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    license: {
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

const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);

module.exports = { Pharmacist };

