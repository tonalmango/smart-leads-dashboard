import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserPayload } from '../types';

export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, env.jwt.secret) as UserPayload;
};
