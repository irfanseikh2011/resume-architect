"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Schema definition
const ResumeSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// Create and export model
exports.default = mongoose_1.default.model('Resume', ResumeSchema);
