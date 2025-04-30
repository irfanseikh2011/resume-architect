import { Request, Response } from 'express';
import Resume, { IResume } from '../models/Resume';

// Get all resumes for a user
export const getResumes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    
    res.status(200).json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Failed to fetch resumes' });
  }
};

// Get a specific resume by ID
export const getResumeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Failed to fetch resume' });
  }
};

// Create a new resume
export const createResume = async (req: Request, res: Response) => {
  try {
    const resumeData = req.body;
    
    if (!resumeData.userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const newResume = new Resume(resumeData);
    await newResume.save();
    
    res.status(201).json(newResume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ message: 'Failed to create resume' });
  }
};

// Update an existing resume
export const updateResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resumeData = req.body;
    
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      resumeData,
      { new: true }
    );
    
    if (!updatedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.status(200).json(updatedResume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Failed to update resume' });
  }
};

// Delete a resume
export const deleteResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedResume = await Resume.findByIdAndDelete(id);
    
    if (!deletedResume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Failed to delete resume' });
  }
};

// Increment download count
export const incrementDownload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const resume = await Resume.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.status(200).json({ downloadCount: resume.downloadCount });
  } catch (error) {
    console.error('Error incrementing download count:', error);
    res.status(500).json({ message: 'Failed to update download count' });
  }
};

// Increment preview count
export const incrementPreview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const resume = await Resume.findByIdAndUpdate(
      id,
      { $inc: { previewCount: 1 } },
      { new: true }
    );
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.status(200).json({ previewCount: resume.previewCount });
  } catch (error) {
    console.error('Error incrementing preview count:', error);
    res.status(500).json({ message: 'Failed to update preview count' });
  }
};