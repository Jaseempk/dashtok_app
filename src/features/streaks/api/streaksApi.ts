import { api } from '@/lib/api/client';
import type { Streak } from '../types/streak.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const streaksApi = {
  // GET /streaks - Get current user's streak
  getStreak: async (): Promise<Streak> => {
    const response = await api.get<ApiResponse<Streak>>('/streaks');
    return response.data;
  },

  // POST /streaks/check - Force check and update streak
  checkStreak: async (): Promise<Streak> => {
    const response = await api.post<ApiResponse<Streak>>('/streaks/check');
    return response.data;
  },
};
