import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
  patientId: mongoose.Types.ObjectId;
  visitType: 'new' | 'follow-up';
  symptoms: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedDoctorId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitSchema = new Schema<IVisit>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    visitType: {
      type: String,
      enum: ['new', 'follow-up'],
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    assignedDoctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Visit = mongoose.model<IVisit>('Visit', visitSchema);

