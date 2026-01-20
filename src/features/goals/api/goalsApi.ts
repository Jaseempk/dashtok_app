import { api } from '@/lib/api/client';
import type { Goal, CreateGoalInput, UpdateGoalInput } from '../types/goal.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const goalsApi = {
  // GET /goals - List user's goals
  getGoals: async (activeOnly = false): Promise<Goal[]> => {
    const endpoint = activeOnly ? '/goals?active=true' : '/goals';
    const response = await api.get<ApiResponse<Goal[]>>(endpoint);
    return response.data;
  },

  // GET /goals/:id - Single goal
  getGoal: async (id: string): Promise<Goal> => {
    const response = await api.get<ApiResponse<Goal>>(`/goals/${id}`);
    return response.data;
  },

  // POST /goals - Create goal
  createGoal: async (data: CreateGoalInput): Promise<Goal> => {
    const response = await api.post<ApiResponse<Goal>>('/goals', data);
    return response.data;
  },

  // PATCH /goals/:id - Update goal
  updateGoal: async (id: string, data: UpdateGoalInput): Promise<Goal> => {
    const response = await api.patch<ApiResponse<Goal>>(`/goals/${id}`, data);
    return response.data;
  },

  // DELETE /goals/:id - Delete goal
  deleteGoal: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};
