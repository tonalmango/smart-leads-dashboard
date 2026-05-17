import apiClient from './apiClient';
import { ApiResponse, User, UserRole } from '@/types';

interface AuthPayload {
  token: string;
  user: User;
}

export const authService = {
  register: async (name: string, email: string, password: string, role: UserRole) => {
    const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return data;
  },

  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    return data;
  },
};
