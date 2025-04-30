"use strict";
// import express from 'express';
// import { generateQuestions , generateCoverLetter} from '../controllers/aiController';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// // Generate interview questions based on resume data
// router.post('/generate-questions', generateQuestions);
// // Generate cover letter based on resume and job description
// router.post('/generate-cover-letter', generateCoverLetter);
// export default router;
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const router = express_1.default.Router();
// Generate interview questions based on resume data
router.post('/generate-questions', aiController_1.generateQuestions);
// Generate cover letter based on resume and job description
router.post('/generate-cover-letter', aiController_1.generateCoverLetter);
// Get all generated content for a resume
router.get('/content', aiController_1.getGeneratedContent);
// Delete generated content
router.delete('/content/:id', aiController_1.deleteGeneratedContent);
exports.default = router;
