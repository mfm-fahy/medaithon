import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  userId: mongoose.Types.ObjectId;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

