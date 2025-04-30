// import express from 'express';
// import { generateQuestions , generateCoverLetter} from '../controllers/aiController';

// const router = express.Router();

// // Generate interview questions based on resume data
// router.post('/generate-questions', generateQuestions);

// // Generate cover letter based on resume and job description
// router.post('/generate-cover-letter', generateCoverLetter);

// export default router;




import express from 'express';
import { 
  generateQuestions, 
  generateCoverLetter,
  getGeneratedContent,
  deleteGeneratedContent
} from '../controllers/aiController';

const router = express.Router();

// Generate interview questions based on resume data
router.post('/generate-questions', generateQuestions);

// Generate cover letter based on resume and job description
router.post('/generate-cover-letter', generateCoverLetter);

// Get all generated content for a resume
router.get('/content', getGeneratedContent);

// Delete generated content
router.delete('/content/:id', deleteGeneratedContent);

export default router;