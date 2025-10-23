import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  patientId: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  phone: string;
  occupation: string;
  address: string;
  medicalHistory?: string;
  allergies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
    },
    allergies: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);

