const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const possibleDiseaseSchema = new mongoose.Schema({
  disease: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
  },
  description: {
    type: String,
  },
});

const chatSessionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    messages: [chatMessageSchema],
    symptoms: {
      type: [String],
      default: [],
    },
    possibleDiseases: [possibleDiseaseSchema],
    medicineQuestions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = { ChatSession };

