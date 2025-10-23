import mongoose, { Schema, Document } from 'mongoose';

export interface ILabTest extends Document {
  patientId: mongoose.Types.ObjectId;
  labTechnicianId?: mongoose.Types.ObjectId;
  testName: string;
  sampleType: string;
  status: 'pending' | 'in-progress' | 'completed';
  estimatedTime?: string;
  result?: string;
  resultDate?: Date;
  uploadedFile?: {
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
    data: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const labTestSchema = new Schema<ILabTest>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    labTechnicianId: {
      type: Schema.Types.ObjectId,
      ref: 'LabTechnician',
    },
    testName: {
      type: String,
      required: true,
    },
    sampleType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    estimatedTime: {
      type: String,
    },
    result: {
      type: String,
    },
    resultDate: {
      type: Date,
    },
    uploadedFile: {
      name: String,
      type: String,
      size: Number,
      uploadedAt: Date,
      data: String,
    },
  },
  { timestamps: true }
);

export const LabTest = mongoose.model<ILabTest>('LabTest', labTestSchema);

