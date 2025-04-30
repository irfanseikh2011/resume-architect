import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

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
const app = express();
const PORT = process.env.PORT || 3000;

// Set language and locale
app.locals.lang = 'en';
process.env.LANG = 'en_US.UTF-8';
process.env.LANGUAGE = 'en_US:en';
process.env.LC_ALL = 'en_US.UTF-8';

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://test-resumebuilder.netlify.app/' || ''].filter(Boolean)
    : ['http://localhost:5173', 'https://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Import routes
import resumeRoutes from './routes/resumeRoutes';
import aiRoutes from './routes/aiRoutes';
import userRoutes from './routes/userRoutes';

// Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint - Updated to use /api prefix
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    language: app.locals.lang,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    mongodbConnected: mongoose.connection.readyState === 1
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
  console.log('MongoDB connected:', mongoose.connection.readyState === 1);
});

export default app;