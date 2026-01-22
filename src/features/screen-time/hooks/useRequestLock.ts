import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { enforcementApi } from '../api/enforcementApi';
import { enforcementService } from '../services/enforcementService';
import { useBlockedApps } from './useBlockedApps';

/**
 * Request to lock apps (manual lock or time exhausted).
 */
export function useRequestLock() {
  const queryClient = useQueryClient();
  const { data: blockedApps } = useBlockedApps();

  return useMutation({
    mutationFn: async () => {
      // 1. Notify server of lock
      const result = await enforcementApi.requestLock();

      // 2. Apply block to device
      if (result.locked && blockedApps?.selectionId) {
        await enforcementService.blockApps(blockedApps.selectionId);
      }

      return result;
    },
    onSuccess: () => {
      // Refresh enforcement status
      queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.usage.all });
    },
  });
}
