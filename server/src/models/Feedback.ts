import mongoose, { Schema, Document } from "mongoose"

export interface IFeedback extends Document {
  patientId: string
  rating: number
  category: string
  message: string
  timestamp: Date
  status: "new" | "reviewed" | "resolved"
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

const feedbackSchema = new Schema<IFeedback>(
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

const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema)

export default Feedback

