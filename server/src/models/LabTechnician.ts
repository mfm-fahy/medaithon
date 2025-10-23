import mongoose, { Schema, Document } from 'mongoose';

export interface ILabTechnician extends Document {
  userId: mongoose.Types.ObjectId;
  department?: string;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const labTechnicianSchema = new Schema<ILabTechnician>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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

export const LabTechnician = mongoose.model<ILabTechnician>('LabTechnician', labTechnicianSchema);

