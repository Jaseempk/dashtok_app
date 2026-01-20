import { api } from '@/lib/api/client';
import type { User, UpdateUserInput } from '../types/user.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const userApi = {
  // GET /users/me - Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return response.data;
  },

  // PATCH /users/me - Update current user profile
  updateProfile: async (data: UpdateUserInput): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>('/users/me', data);
    return response.data;
  },

  // DELETE /users/me - Delete current user account
  deleteAccount: async (): Promise<void> => {
    await api.delete('/users/me');
  },
};
