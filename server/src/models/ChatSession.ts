import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  patientId: mongoose.Types.ObjectId;
  messages: IChatMessage[];
  symptoms: string[];
  possibleDiseases: Array<{
    disease: string;
    confidence: number;
    description: string;
  }>;
  medicineQuestions: string[];
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
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

const possibleDiseaseSchema = new Schema({
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

const chatSessionSchema = new Schema<IChatSession>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
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

export const ChatSession = mongoose.model<IChatSession>('ChatSession', chatSessionSchema);

