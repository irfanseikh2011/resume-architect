"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockAchievement = exports.getUserStats = exports.updateUserProfile = exports.getUserById = void 0;
const User_1 = __importDefault(require("../models/User"));
const Resume_1 = __importDefault(require("../models/Resume"));
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};
exports.getUserById = getUserById;
// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profileData = req.body;
        const updatedUser = await User_1.default.findByIdAndUpdate(id, profileData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Failed to update user profile' });
    }
};
exports.updateUserProfile = updateUserProfile;
// Get user statistics
const getUserStats = async (req, res) => {
    try {
        const { id } = req.params;
        // Get resume counts
        const resumeCount = await Resume_1.default.countDocuments({ userId: id });
        // Calculate total downloads and previews
        const resumes = await Resume_1.default.find({ userId: id });
        const totalDownloads = resumes.reduce((sum, resume) => sum + (resume.downloadCount || 0), 0);
        const totalPreviews = resumes.reduce((sum, resume) => sum + (resume.previewCount || 0), 0);
        // Get user information
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const stats = {
            resumeCount,
            totalDownloads,
            totalPreviews,
            coverLetterCount: user.coverLetterCount || 0,
            interviewPrepsCount: user.interviewPrepsCount || 0,
            achievements: user.achievements || [],
        };
        res.status(200).json(stats);
    }
    catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Failed to fetch user statistics' });
    }
};
exports.getUserStats = getUserStats;
// Unlock achievement
const unlockAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const { achievement } = req.body;
        if (!achievement || !achievement.name || !achievement.description) {
            return res.status(400).json({ message: 'Invalid achievement data' });
        }
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if achievement already exists
        const achievementExists = user.achievements.some((a) => a.name === achievement.name);
        if (achievementExists) {
            return res.status(200).json({ message: 'Achievement already unlocked', achievements: user.achievements });
        }
        // Add achievement with timestamp
        const newAchievement = {
            ...achievement,
            unlockedAt: new Date(),
        };
        const updatedUser = await User_1.default.findByIdAndUpdate(id, { $push: { achievements: newAchievement } }, { new: true });
        res.status(200).json({
            message: 'Achievement unlocked successfully',
            achievements: updatedUser?.achievements,
        });
    }
    catch (error) {
        console.error('Error unlocking achievement:', error);
        res.status(500).json({ message: 'Failed to unlock achievement' });
    }
};
exports.unlockAchievement = unlockAchievement;
