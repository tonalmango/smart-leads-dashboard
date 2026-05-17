/**
 * Centralized environment configuration.
 * All process.env access goes through this module — no hardcoded values elsewhere.
 */

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: (process.env.NODE_ENV ?? 'development') as 'development' | 'production' | 'test',
  port: parseInt(process.env.PORT ?? '5000', 10),
  mongoUri: requireEnv('MONGODB_URI'),
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
} as const;
