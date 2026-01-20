import { api } from '@/lib/api/client';
import type {
  TodayStats,
  TodayAllowance,
  Streak,
  Goal,
  ApiResponse,
} from '../types/dashboard.types';

export const dashboardApi = {
  // GET /activities/today
  getTodayStats: async (): Promise<TodayStats> => {
    const response = await api.get<ApiResponse<TodayStats>>('/activities/today');
    return response.data;
  },

  // GET /allowances/today
  getTodayAllowance: async (): Promise<TodayAllowance> => {
    const response = await api.get<ApiResponse<TodayAllowance>>('/allowances/today');
    return response.data;
  },

  // GET /streaks
  getStreak: async (): Promise<Streak> => {
    const response = await api.get<ApiResponse<Streak>>('/streaks');
    return response.data;
  },

  // GET /goals?active=true
  getActiveGoals: async (): Promise<Goal[]> => {
    const response = await api.get<ApiResponse<Goal[]>>('/goals?active=true');
    return response.data;
  },

  // POST /streaks/check - Force check streak
  checkStreak: async (): Promise<Streak> => {
    const response = await api.post<ApiResponse<Streak>>('/streaks/check');
    return response.data;
  },

  // POST /allowances/recalculate - Force recalculate allowance
  recalculateAllowance: async (): Promise<TodayAllowance> => {
    const response = await api.post<ApiResponse<TodayAllowance>>('/allowances/recalculate');
    return response.data;
  },
};
