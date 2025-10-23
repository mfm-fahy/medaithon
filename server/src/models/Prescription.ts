import mongoose, { Schema, Document } from 'mongoose';

export interface IPrescription extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  medicine: string;
  route: string;
  dose: string;
  frequency: string;
  duration: string;
  advice: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    medicine: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    dose: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    advice: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);

