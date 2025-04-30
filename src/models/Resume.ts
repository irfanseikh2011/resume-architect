import mongoose, { Schema, Document } from 'mongoose';

// Interface for Resume Document
export interface IResume extends Document {
  userId: string;
  name: string;
  style: 'Formal' | 'Creative' | 'Technical' | 'Managerial';
  templateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: Date;
    url?: string;
  }[];
  languages?: {
    language: string;
    proficiency: string;
  }[];
  projects?: {
    name: string;
    description: string;
    url?: string;
    technologies: string[];
  }[];
  pdfUrl?: string;
  downloadCount: number;
  previewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const ResumeSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      enum: ['Formal', 'Creative', 'Technical', 'Managerial'],
      default: 'Formal',
    },
    templateId: {
      type: String,
      required: true,
    },
    personalInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      linkedin: String,
      website: String,
      summary: {
        type: String,
        required: true,
      },
    },
    experience: [
      {
        company: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          required: true,
        },
        achievements: [String],
      },
    ],
    education: [
      {
        institution: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        field: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        current: {
          type: Boolean,
          default: false,
        },
        description: String,
      },
    ],
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
      },
    ],
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        issuer: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
        url: String,
      },
    ],
    languages: [
      {
        language: {
          type: String,
          required: true,
        },
        proficiency: {
          type: String,
          required: true,
        },
      },
    ],
    projects: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        url: String,
        technologies: [String],
      },
    ],
    pdfUrl: String,
    downloadCount: {
      type: Number,
      default: 0,
    },
    previewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create and export model
export default mongoose.model<IResume>('Resume', ResumeSchema);