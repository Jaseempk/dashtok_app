import { api } from '@/lib/api/client';
import type {
  TodayAllowance,
  Allowance,
  AllowanceHistoryFilters,
  UpdateUsedMinutesInput,
} from '../types/allowance.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const allowancesApi = {
  // GET /allowances/today - Get today's allowance
  getTodayAllowance: async (): Promise<TodayAllowance> => {
    const response = await api.get<ApiResponse<TodayAllowance>>('/allowances/today');
    return response.data;
  },

  // GET /allowances/history - Get allowance history
  getHistory: async (filters?: AllowanceHistoryFilters): Promise<Allowance[]> => {
    const params = new URLSearchParams();
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    const endpoint = query ? `/allowances/history?${query}` : '/allowances/history';
    const response = await api.get<ApiResponse<Allowance[]>>(endpoint);
    return response.data;
  },

  // PATCH /allowances/today/used - Update used minutes
  updateUsedMinutes: async (data: UpdateUsedMinutesInput): Promise<Allowance> => {
    const response = await api.patch<ApiResponse<Allowance>>('/allowances/today/used', data);
    return response.data;
  },

  // POST /allowances/recalculate - Force recalculate
  recalculate: async (): Promise<Allowance> => {
    const response = await api.post<ApiResponse<Allowance>>('/allowances/recalculate');
    return response.data;
  },
};
