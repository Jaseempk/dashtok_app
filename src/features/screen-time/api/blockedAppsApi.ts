import { api } from '@/lib/api/client';
import type {
  BlockedApps,
  CreateBlockedAppsInput,
  UpdateBlockedAppsInput,
} from '../types/screenTime.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const blockedAppsApi = {
  // GET /blocked-apps - Get user's blocked apps configuration
  getBlockedApps: async (): Promise<BlockedApps | null> => {
    const response = await api.get<ApiResponse<BlockedApps | null>>('/blocked-apps');
    return response.data;
  },

  // POST /blocked-apps - Save user's app selection
  createBlockedApps: async (data: CreateBlockedAppsInput): Promise<BlockedApps> => {
    const response = await api.post<ApiResponse<BlockedApps>>('/blocked-apps', data);
    return response.data;
  },

  // PATCH /blocked-apps - Update blocked apps settings
  updateBlockedApps: async (data: UpdateBlockedAppsInput): Promise<BlockedApps> => {
    const response = await api.patch<ApiResponse<BlockedApps>>('/blocked-apps', data);
    return response.data;
  },

  // DELETE /blocked-apps - Remove all blocked apps (disable feature)
  deleteBlockedApps: async (): Promise<{ deleted: boolean }> => {
    const response = await api.delete<ApiResponse<{ deleted: boolean }>>('/blocked-apps');
    return response.data;
  },

  // DELETE /blocked-apps/pending - Cancel pending changes
  cancelPendingChanges: async (): Promise<BlockedApps> => {
    const response = await api.delete<ApiResponse<BlockedApps>>('/blocked-apps/pending');
    return response.data;
  },
};
