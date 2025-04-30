"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Get user profile
router.get('/:id', userController_1.getUserById);
// Update user profile
router.put('/:id', userController_1.updateUserProfile);
// Get user statistics
router.get('/:id/stats', userController_1.getUserStats);
// Unlock achievement
router.post('/:id/achievements', userController_1.unlockAchievement);
exports.default = router;
