const mongoose = require("mongoose")

const adrSchema = new mongoose.Schema(
  {
    // Patient Information
    patientName: {
      type: String,
      required: true,
    },
    patientAge: String,
    patientGender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    // Medicine Information
    medicineNames: {
      type: String,
      required: true,
    },

    // Adverse Reaction Details
    adverseReaction: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe", "life-threatening"],
      default: "mild",
    },
    dateOfOnset: Date,
    actionTaken: String,
    outcome: {
      type: String,
      enum: ["ongoing", "recovered", "recovering", "not-recovered", "fatal"],
      default: "ongoing",
    },

    // Reporter Information
    reporterName: String,
    reporterPhone: String,
    reporterEmail: String,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submittedByName: String,

    // Additional Information
    additionalNotes: String,
    status: {
      type: String,
      enum: ["submitted", "under-review", "acknowledged", "closed"],
      default: "submitted",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewNotes: String,
    reviewedAt: Date,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Index for faster queries
adrSchema.index({ patientName: 1 })
adrSchema.index({ status: 1 })
adrSchema.index({ createdAt: -1 })
adrSchema.index({ submittedBy: 1 })

module.exports = mongoose.model("ADR", adrSchema)

