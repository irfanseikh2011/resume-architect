"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resumeController_1 = require("../controllers/resumeController");
const router = express_1.default.Router();
// Get all resumes for a user
router.get('/', resumeController_1.getResumes);
// Get a specific resume by ID
router.get('/:id', resumeController_1.getResumeById);
// Create a new resume
router.post('/', resumeController_1.createResume);
// Update an existing resume
router.put('/:id', resumeController_1.updateResume);
// Delete a resume
router.delete('/:id', resumeController_1.deleteResume);
// Increment download count
router.post('/:id/download', resumeController_1.incrementDownload);
// Increment preview count
router.post('/:id/preview', resumeController_1.incrementPreview);
exports.default = router;
