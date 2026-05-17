import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (env.nodeEnv === 'development') {
    console.error('[ErrorHandler]', err);
  }

  // Known operational errors
  if (err instanceof AppError) {
    const detail = env.nodeEnv === 'development' ? err.stack : undefined;
    sendError(res, err.message, err.statusCode, detail);
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(', ');
    sendError(res, message, 400, 'Validation failed');
    return;
  }

  // Mongoose duplicate key error
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: number }).code === 11000
  ) {
    sendError(res, 'A record with that value already exists.', 409);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err as { name: string }).name === 'CastError'
  ) {
    sendError(res, 'Invalid resource ID.', 400);
    return;
  }

  const message =
    env.nodeEnv === 'development' && err instanceof Error
      ? err.message
      : 'An unexpected error occurred';

  sendError(res, message, 500);
};

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 'Route not found', 404);
};
