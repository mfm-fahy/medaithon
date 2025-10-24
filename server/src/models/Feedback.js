const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      required: true,
      enum: ["general", "staff", "facilities", "treatment", "cleanliness", "wait_time"],
      default: "general",
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "resolved"],
      default: "new",
    },
    adminNotes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Feedback = mongoose.model("Feedback", feedbackSchema)

module.exports = Feedback

