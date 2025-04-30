import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneratedContent extends Document {
  userId: string;
  resumeId: string;
  type: 'cover-letter' | 'interview-questions';
  content: string;
  metadata?: {
    jobDescription?: string;
    generatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedContentSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    resumeId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['cover-letter', 'interview-questions'],
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      jobDescription: String,
      generatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGeneratedContent>('GeneratedContent', GeneratedContentSchema);