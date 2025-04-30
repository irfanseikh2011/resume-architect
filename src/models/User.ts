import mongoose, { Schema, Document } from 'mongoose';

// Interface for User Document
export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  resumeCount: number;
  coverLetterCount: number;
  interviewPrepsCount: number;
  achievements: {
    name: string;
    description: string;
    icon?: string;
    unlockedAt: Date;
  }[];
}

// Schema definition
const UserSchema: Schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: String,
    resumeCount: {
      type: Number,
      default: 0,
    },
    coverLetterCount: {
      type: Number,
      default: 0,
    },
    interviewPrepsCount: {
      type: Number,
      default: 0,
    },
    achievements: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        icon: String,
        unlockedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create and export model
export default mongoose.model<IUser>('User', UserSchema);