import { api } from '@/lib/api/client';
import type {
  Activity,
  ActivityListResponse,
  ActivityFilters,
  CreateActivityInput,
  ActivityStats,
} from '../types/activity.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const activitiesApi = {
  // GET /activities - List with filters
  getActivities: async (filters: ActivityFilters = {}): Promise<ActivityListResponse> => {
    const params = new URLSearchParams();
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    if (filters.type) params.set('type', filters.type);
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.page) params.set('page', filters.page.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/activities?${queryString}` : '/activities';

    const response = await api.get<PaginatedResponse<Activity>>(endpoint);
    return {
      data: response.data,
      total: response.total,
      page: response.page,
      limit: response.limit,
    };
  },

  // GET /activities/:id - Single activity
  getActivity: async (id: string): Promise<Activity> => {
    const response = await api.get<ApiResponse<Activity>>(`/activities/${id}`);
    return response.data;
  },

  // GET /activities/today - Today's stats
  getTodayStats: async (): Promise<ActivityStats> => {
    const response = await api.get<ApiResponse<ActivityStats>>('/activities/today');
    return response.data;
  },

  // POST /activities - Create activity
  createActivity: async (data: CreateActivityInput): Promise<Activity> => {
    const response = await api.post<ApiResponse<Activity>>('/activities', data);
    return response.data;
  },

  // DELETE /activities/:id - Delete activity
  deleteActivity: async (id: string): Promise<void> => {
    await api.delete(`/activities/${id}`);
  },
};
