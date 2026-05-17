import dotenv from 'dotenv';
dotenv.config();

import createApp from './app';
import connectDB from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  await connectDB();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });
};

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
