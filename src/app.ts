import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import collectionRoutes from './routes/discogs/collection';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally: clean up resources, but don't exit
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Optionally: clean up resources, but don't exit
});

// Routes
app.use('/', collectionRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
