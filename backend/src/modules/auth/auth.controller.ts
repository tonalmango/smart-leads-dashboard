import { Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AuthRequest } from '../../types';
import { RegisterInput, LoginInput } from './auth.schemas';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await authService.register(req.body as RegisterInput);
  sendSuccess(res, 'Registration successful', result, 201);
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await authService.login(req.body as LoginInput);
  sendSuccess(res, 'Login successful', result);
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, 'User fetched successfully', user);
};
