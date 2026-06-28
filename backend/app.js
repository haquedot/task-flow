import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/tasks', taskRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MERN Task Tracker API is running...',
  });
});

// Catch-all route handler for 404s
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
});

// Error middleware
app.use(errorHandler);

export default app;
