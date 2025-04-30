"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables
dotenv_1.default.config();
// Validate critical environment variables
if (!process.env.MONGODB_URI) {
    console.error('ERROR: MongoDB URI is not set');
    console.error('Please set the MONGODB_URI environment variable in your .env file');
    process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable is not set');
    console.error('Please set the OPENAI_API_KEY environment variable in your .env file');
    process.exit(1);
}
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Set language and locale
app.locals.lang = 'en';
process.env.LANG = 'en_US.UTF-8';
process.env.LANGUAGE = 'en_US:en';
process.env.LC_ALL = 'en_US.UTF-8';
// Configure CORS
// const corsOptions = {
//   origin: process.env.NODE_ENV === 'production' 
//     ? [process.env.FRONTEND_URL || 'https://test-resumebuilder.netlify.app/' || ''].filter(Boolean)
//     : ['http://localhost:5173', 'https://localhost:5173'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   maxAge: 86400 // 24 hours
// };
// Apply middlewares
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB successfully');
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
// Import routes
const resumeRoutes_1 = __importDefault(require("./routes/resumeRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Routes
app.use('/api/resumes', resumeRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
// Health check endpoint - Updated to use /api prefix
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        language: app.locals.lang,
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        mongodbConnected: mongoose_1.default.connection.readyState === 1
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        status: err.status,
        code: err.code,
        name: err.name
    });
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? {
            stack: err.stack,
            code: err.code,
            name: err.name
        } : {},
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log('OpenAI API key configured:', !!process.env.OPENAI_API_KEY);
    console.log('MongoDB connected:', mongoose_1.default.connection.readyState === 1);
});
exports.default = app;
