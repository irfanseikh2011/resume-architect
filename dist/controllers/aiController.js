"use strict";
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
        const prompt = `Generate 40 personalized interview questions based on this candidate:

    Name: ${resumeData.personalInfo.name}
    Role: ${resumeData.personalInfo.role || 'Not specified'}
    Summary: ${resumeData.personalInfo.summary || 'No summary provided'}

    Key Skills: ${resumeData.skills.slice(0, 5).map((skill) => skill.name).join(', ')}
    Top Achievements: ${resumeData.experience.slice(0, 2).flatMap((exp) => exp.achievements).join(', ')}

    Group them as:
    1. Technical Questions (10)
    2. Behavioral Questions (10)
    3. HR Questions (10)
    4. Leadership Questions (10)

    Format:
    Q1: [Question]
    Sample Answer: [Answer]`;
        const systemMessage = `You are an experienced interviewer specializing in technical and leadership hiring. Create relevant, challenging questions and strong sample answers. Focus on both technical depth and interpersonal skills.`;
        const content = await (0, aiService_1.callOpenAI)(prompt, systemMessage);
        // Save generated questions to MongoDB
        const generatedContent = new GeneratedContent_1.default({
            userId: resumeData.userId,
            resumeId: resumeData.id,
            type: 'interview-questions',
            content,
            metadata: {
                generatedAt: new Date(),
            },
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
        const prompt = `Generate a professional cover letter based on this candidate's profile and job description:

    CANDIDATE PROFILE:
    Name: ${resumeData.personalInfo.name}
    Current Role: ${resumeData.personalInfo.role || 'Not specified'}
    Key Experience: ${resumeData.experience[0]?.position} at ${resumeData.experience[0]?.company}
    Top Skills: ${resumeData.skills.slice(0, 5).map((skill) => skill.name).join(', ')}
    Notable Achievements: ${resumeData.experience[0]?.achievements.slice(0, 2).join('; ')}

    JOB DESCRIPTION:
    ${jobDescription}

    Please create a compelling cover letter that:
    1. Opens with a strong, personalized introduction
    2. Aligns the candidate's experience with job requirements
    3. Highlights relevant achievements and skills
    4. Demonstrates enthusiasm and cultural fit
    5. Concludes with a clear call to action
    6. Maintains a professional yet engaging tone
    7. Keeps length to 350-400 words

    Format as a proper business letter with appropriate spacing and structure.`;
        const systemMessage = `You are an expert cover letter writer with experience in crafting compelling, ATS-friendly cover letters. Focus on creating a personalized narrative that connects the candidate's experience with the job requirements while maintaining a professional tone. The letter should be concise, impactful, and highlight the candidate's unique value proposition.`;
        const content = await (0, aiService_1.callOpenAI)(prompt, systemMessage);
        // Save generated cover letter to MongoDB
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
        if (type) {
            query.type = type;
        }
        const content = await GeneratedContent_1.default.find(query).sort({ createdAt: -1 });
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
