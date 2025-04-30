"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementPreview = exports.incrementDownload = exports.deleteResume = exports.updateResume = exports.createResume = exports.getResumeById = exports.getResumes = void 0;
const Resume_1 = __importDefault(require("../models/Resume"));
// Get all resumes for a user
const getResumes = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const resumes = await Resume_1.default.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json(resumes);
    }
    catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ message: 'Failed to fetch resumes' });
    }
};
exports.getResumes = getResumes;
// Get a specific resume by ID
const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume_1.default.findById(id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(resume);
    }
    catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ message: 'Failed to fetch resume' });
    }
};
exports.getResumeById = getResumeById;
// Create a new resume
const createResume = async (req, res) => {
    try {
        const resumeData = req.body;
        if (!resumeData.userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const newResume = new Resume_1.default(resumeData);
        await newResume.save();
        res.status(201).json(newResume);
    }
    catch (error) {
        console.error('Error creating resume:', error);
        res.status(500).json({ message: 'Failed to create resume' });
    }
};
exports.createResume = createResume;
// Update an existing resume
const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        const resumeData = req.body;
        const updatedResume = await Resume_1.default.findByIdAndUpdate(id, resumeData, { new: true });
        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json(updatedResume);
    }
    catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).json({ message: 'Failed to update resume' });
    }
};
exports.updateResume = updateResume;
// Delete a resume
const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedResume = await Resume_1.default.findByIdAndDelete(id);
        if (!deletedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ message: 'Resume deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ message: 'Failed to delete resume' });
    }
};
exports.deleteResume = deleteResume;
// Increment download count
const incrementDownload = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume_1.default.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ downloadCount: resume.downloadCount });
    }
    catch (error) {
        console.error('Error incrementing download count:', error);
        res.status(500).json({ message: 'Failed to update download count' });
    }
};
exports.incrementDownload = incrementDownload;
// Increment preview count
const incrementPreview = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume_1.default.findByIdAndUpdate(id, { $inc: { previewCount: 1 } }, { new: true });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.status(200).json({ previewCount: resume.previewCount });
    }
    catch (error) {
        console.error('Error incrementing preview count:', error);
        res.status(500).json({ message: 'Failed to update preview count' });
    }
};
exports.incrementPreview = incrementPreview;
