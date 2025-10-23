import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  chemicalName: string;
  brandName: string;
  quantity: number;
  price?: number;
  expiryDate?: Date;
  manufacturer?: string;
  batchNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    chemicalName: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
    },
    expiryDate: {
      type: Date,
    },
    manufacturer: {
      type: String,
    },
    batchNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Medicine = mongoose.model<IMedicine>('Medicine', medicineSchema);

