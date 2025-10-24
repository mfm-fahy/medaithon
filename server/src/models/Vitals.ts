import mongoose, { Schema, Document } from 'mongoose';

export interface IVitals extends Document {
  patientId: mongoose.Types.ObjectId;
  nurseId: mongoose.Types.ObjectId;
  height: number;
  weight: number;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  pulse: number;
  triageColor?: string; // Triage color: red, yellow, green, blue
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const vitalsSchema = new Schema<IVitals>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    nurseId: {
      type: Schema.Types.ObjectId,
      ref: 'Nurse',
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    bloodPressure: {
      type: String,
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
    },
    respiratoryRate: {
      type: Number,
      required: true,
    },
    pulse: {
      type: Number,
      required: true,
    },
    triageColor: {
      type: String,
      enum: ['red', 'yellow', 'green', 'blue'],
      default: null,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Vitals = mongoose.model<IVitals>('Vitals', vitalsSchema);

