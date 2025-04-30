import express from 'express';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  incrementDownload,
  incrementPreview,
} from '../controllers/resumeController';

const router = express.Router();

// Get all resumes for a user
router.get('/', getResumes);

// Get a specific resume by ID
router.get('/:id', getResumeById);

// Create a new resume
router.post('/', createResume);

// Update an existing resume
router.put('/:id', updateResume);

// Delete a resume
router.delete('/:id', deleteResume);

// Increment download count
router.post('/:id/download', incrementDownload);

// Increment preview count
router.post('/:id/preview', incrementPreview);

export default router;