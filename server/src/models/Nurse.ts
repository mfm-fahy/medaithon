import mongoose, { Schema, Document } from 'mongoose';

export interface INurse extends Document {
  userId: mongoose.Types.ObjectId;
  department?: string;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const nurseSchema = new Schema<INurse>(
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

export const Nurse = mongoose.model<INurse>('Nurse', nurseSchema);

