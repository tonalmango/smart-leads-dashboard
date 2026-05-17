import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import leadRoutes from './modules/leads/lead.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const createApp = (): Application => {
  const app = express();

  // ── Core Middleware ──────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (env.nodeEnv === 'development') {
    app.use(morgan('dev'));
  }

  // ── Health Check ─────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', environment: env.nodeEnv, timestamp: new Date().toISOString() });
  });

  // ── API Routes ────────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);

  // ── Error Handling ────────────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createApp;
