import { api } from '@/lib/api/client';
import type {
  StartSessionInput,
  StartSessionResult,
  EndSessionInput,
  EndSessionResult,
  TodayUsage,
} from '../types/screenTime.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const usageApi = {
  // POST /usage/session/start - Start a usage session
  startSession: async (data: StartSessionInput): Promise<StartSessionResult> => {
    const response = await api.post<ApiResponse<StartSessionResult>>(
      '/usage/session/start',
      data
    );
    return response.data;
  },

  // POST /usage/session/end - End a usage session
  // SECURITY: Server calculates duration - never trust client duration
  endSession: async (data: EndSessionInput): Promise<EndSessionResult> => {
    const response = await api.post<ApiResponse<EndSessionResult>>(
      '/usage/session/end',
      data
    );
    return response.data;
  },

  // GET /usage/today - Get today's usage summary
  getTodayUsage: async (): Promise<TodayUsage> => {
    const response = await api.get<ApiResponse<TodayUsage>>('/usage/today');
    return response.data;
  },
};
