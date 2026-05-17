import User from '../../models/User';
import { generateToken } from '../../utils/jwt';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../utils/AppError';
import { UserPayload, UserRole } from '../../types';
import { RegisterInput, LoginInput } from './auth.schemas';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
    });

    const payload: UserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await User.findOne({ email: input.email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: UserPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  },
};
