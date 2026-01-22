import { api } from '@/lib/api/client';
import type {
  EnforcementStatus,
  UnlockResult,
  LockResult,
  BypassResult,
} from '../types/screenTime.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const enforcementApi = {
  // GET /enforcement/status - Get current enforcement state
  getStatus: async (): Promise<EnforcementStatus> => {
    const response = await api.get<ApiResponse<EnforcementStatus>>('/enforcement/status');
    return response.data;
  },

  // POST /enforcement/unlock - Request to unlock apps
  // SECURITY: Server validates goal completion - never trust client
  requestUnlock: async (): Promise<UnlockResult> => {
    const response = await api.post<ApiResponse<UnlockResult>>('/enforcement/unlock');
    return response.data;
  },

  // POST /enforcement/lock - Request to lock apps
  requestLock: async (): Promise<LockResult> => {
    const response = await api.post<ApiResponse<LockResult>>('/enforcement/lock');
    return response.data;
  },

  // POST /enforcement/emergency-bypass - Request emergency bypass
  // SECURITY: Server enforces rate limit (max 3 per day)
  requestEmergencyBypass: async (): Promise<BypassResult> => {
    const response = await api.post<ApiResponse<BypassResult>>('/enforcement/emergency-bypass');
    return response.data;
  },
};
