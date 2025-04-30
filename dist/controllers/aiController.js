"use strict";
// import { Request, Response } from 'express';
// import { callOpenAI } from '../services/aiService';
// import GeneratedContent from '../models/GeneratedContent';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGeneratedContent = exports.getGeneratedContent = exports.generateCoverLetter = exports.generateQuestions = void 0;
const aiService_1 = require("../services/aiService");
const GeneratedContent_1 = __importDefault(require("../models/GeneratedContent"));
// Generate Interview Questions based on Resume
const generateQuestions = async (req, res) => {
    try {
        const { resumeData } = req.body;
        if (!resumeData) {
            return res.status(400).json({ message: 'Resume data is required.' });
        }
        // Optimized prompt structure for faster processing
        const prompt = `Generate 40 interview questions for ${resumeData.personalInfo.name}:
Skills: ${resumeData.skills.slice(0, 5).map((skill) => skill.name).join(', ')}
Experience: ${resumeData.experience[0]?.position} at ${resumeData.experience[0]?.company}
Achievements: ${resumeData.experience[0]?.achievements.slice(0, 2).join('; ')}

Format: 10 questions each for Technical, Behavioral, HR, and Leadership categories.
Each Q&A pair should be concise and focused.`;
        const systemMessage = 'Create relevant interview questions with brief, focused sample answers. Prioritize clarity and practicality.';
        const content = await (0, aiService_1.callOpenAI)(prompt, systemMessage);
        // Save to MongoDB
        const generatedContent = new GeneratedContent_1.default({
            userId: resumeData.userId,
            resumeId: resumeData.id,
            type: 'interview-questions',
            content,
            metadata: { generatedAt: new Date() },
        });
        await generatedContent.save();
        res.status(200).json({ content });
    }
    catch (error) {
        console.error('Error generating interview questions:', error);
        res.status(500).json({ message: error.message || 'Failed to generate interview questions.' });
    }
};
exports.generateQuestions = generateQuestions;
// Generate Cover Letter based on Resume and Job Description
const generateCoverLetter = async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!resumeData || !jobDescription) {
            return res.status(400).json({ message: 'Both resume data and job description are required.' });
        }
        // Optimized prompt for faster, focused generation
        const prompt = `Write cover letter for ${resumeData.personalInfo.name}:
Role: ${resumeData.personalInfo.role || 'Not specified'}
Experience: ${resumeData.experience[0]?.position} at ${resumeData.experience[0]?.company}
Skills: ${resumeData.skills.slice(0, 5).map((skill) => skill.name).join(', ')}
Achievement: ${resumeData.experience[0]?.achievements[0]}

Job Description:
${jobDescription}

Format: Business letter, 350 words max. Focus on matching skills to requirements.`;
        const systemMessage = 'Create a concise, compelling cover letter that connects candidate experience to job requirements.';
        const content = await (0, aiService_1.callOpenAI)(prompt, systemMessage);
        // Save to MongoDB
        const generatedContent = new GeneratedContent_1.default({
            userId: resumeData.userId,
            resumeId: resumeData.id,
            type: 'cover-letter',
            content,
            metadata: {
                jobDescription,
                generatedAt: new Date(),
            },
        });
        await generatedContent.save();
        res.status(200).json({ content });
    }
    catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({ message: error.message || 'Failed to generate cover letter.' });
    }
};
exports.generateCoverLetter = generateCoverLetter;
// Get all generated content for a resume
const getGeneratedContent = async (req, res) => {
    try {
        const { resumeId, type } = req.query;
        if (!resumeId) {
            return res.status(400).json({ message: 'Resume ID is required.' });
        }
        const query = { resumeId };
        if (type)
            query.type = type;
        const content = await GeneratedContent_1.default.find(query)
            .select('-__v')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(content);
    }
    catch (error) {
        console.error('Error fetching generated content:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch generated content.' });
    }
};
exports.getGeneratedContent = getGeneratedContent;
// Delete generated content
const deleteGeneratedContent = async (req, res) => {
    try {
        const { id } = req.params;
        await GeneratedContent_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Content deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting generated content:', error);
        res.status(500).json({ message: error.message || 'Failed to delete generated content.' });
    }
};
exports.deleteGeneratedContent = deleteGeneratedContent;
