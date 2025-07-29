import mongoose, { Document, Schema } from 'mongoose';

export interface IBrochureProgress extends Document {
  userId: string;
  sectionId: string;
  itemId: string;
  completed: boolean;
  notes?: string;
  updatedAt: Date;
}

const brochureProgressSchema = new Schema<IBrochureProgress>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique user-item combinations
brochureProgressSchema.index(
  { userId: 1, sectionId: 1, itemId: 1 },
  { unique: true }
);

export const BrochureProgress = mongoose.model<IBrochureProgress>(
  'BrochureProgress',
  brochureProgressSchema
);
