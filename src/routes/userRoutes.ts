import express from 'express';
import { 
  getUserById, 
  updateUserProfile, 
  getUserStats,
  unlockAchievement
} from '../controllers/userController';

const router = express.Router();

// Get user profile
router.get('/:id', getUserById);

// Update user profile
router.put('/:id', updateUserProfile);

// Get user statistics
router.get('/:id/stats', getUserStats);

// Unlock achievement
router.post('/:id/achievements', unlockAchievement);

export default router;