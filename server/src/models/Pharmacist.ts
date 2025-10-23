import mongoose, { Schema, Document } from 'mongoose';

export interface IPharmacist extends Document {
  userId: mongoose.Types.ObjectId;
  license?: string;
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pharmacistSchema = new Schema<IPharmacist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    license: {
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

export const Pharmacist = mongoose.model<IPharmacist>('Pharmacist', pharmacistSchema);

