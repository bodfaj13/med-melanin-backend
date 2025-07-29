import mongoose, { Document, Schema } from 'mongoose';

export interface ISymptomEntry extends Document {
  userId: string;
  date: string;
  painLevel: number;
  location: string;
  description: string;
  medications: string;
  timestamp: Date;
}

const symptomEntrySchema = new Schema<ISymptomEntry>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    painLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    location: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    medications: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by user and date
symptomEntrySchema.index({ userId: 1, date: -1 });

export const SymptomEntry = mongoose.model<ISymptomEntry>(
  'SymptomEntry',
  symptomEntrySchema
);
