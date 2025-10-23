const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Admin };

