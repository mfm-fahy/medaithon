import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  designation: string;
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  yearsOfExperience?: number;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
    },
    licenseNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    department: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);

