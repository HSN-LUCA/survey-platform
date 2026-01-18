import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from './routes/auth';
import surveyRoutes from './routes/surveys';
import publicSurveyRoutes from './routes/public-surveys';
import { authMiddleware } from './middleware/auth';

dotenv.config({ path: '.env.local' });

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', publicSurveyRoutes);
app.use('/api/admin/surveys', surveyRoutes);
// - Response routes (public)
// - Admin routes (protected with authMiddleware)

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Real-time survey updates will be handled here
  socket.on('join-survey', (surveyId: string) => {
    socket.join(`survey-${surveyId}`);
    console.log(`Client ${socket.id} joined survey ${surveyId}`);
  });

  socket.on('leave-survey', (surveyId: string) => {
    socket.leave(`survey-${surveyId}`);
    console.log(`Client ${socket.id} left survey ${surveyId}`);
  });
});

// Export io and middleware for use in API routes
export { io, authMiddleware };

const PORT = process.env.API_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
