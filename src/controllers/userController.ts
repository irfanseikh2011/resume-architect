import { Request, Response } from 'express';
import User from '../models/User';
import Resume from '../models/Resume';

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profileData = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      profileData,
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

// Get user statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get resume counts
    const resumeCount = await Resume.countDocuments({ userId: id });
    
    // Calculate total downloads and previews
    const resumes = await Resume.find({ userId: id });
    
    const totalDownloads = resumes.reduce((sum, resume) => sum + (resume.downloadCount || 0), 0);
    const totalPreviews = resumes.reduce((sum, resume) => sum + (resume.previewCount || 0), 0);
    
    // Get user information
    const user = await User.findById(id);
    
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
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch user statistics' });
  }
};

// Unlock achievement
export const unlockAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { achievement } = req.body;
    
    if (!achievement || !achievement.name || !achievement.description) {
      return res.status(400).json({ message: 'Invalid achievement data' });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if achievement already exists
    const achievementExists = user.achievements.some(
      (a: any) => a.name === achievement.name
    );
    
    if (achievementExists) {
      return res.status(200).json({ message: 'Achievement already unlocked', achievements: user.achievements });
    }
    
    // Add achievement with timestamp
    const newAchievement = {
      ...achievement,
      unlockedAt: new Date(),
    };
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { achievements: newAchievement } },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Achievement unlocked successfully',
      achievements: updatedUser?.achievements,
    });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    res.status(500).json({ message: 'Failed to unlock achievement' });
  }
};