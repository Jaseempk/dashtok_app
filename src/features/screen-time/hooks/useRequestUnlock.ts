import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { enforcementApi } from '../api/enforcementApi';
import { enforcementService } from '../services/enforcementService';
import { useBlockedApps } from './useBlockedApps';

/**
 * Request unlock from server and apply to device if granted.
 * SECURITY: Server validates goal completion - we never decide client-side.
 */
export function useRequestUnlock() {
  const queryClient = useQueryClient();
  const { data: blockedApps } = useBlockedApps();

  return useMutation({
    mutationFn: async () => {
      // 1. Request unlock from server (server validates goal completion)
      const result = await enforcementApi.requestUnlock();

      // 2. If server grants unlock, apply to device
      if (result.unlocked && blockedApps?.selectionId && result.durationMinutes) {
        await enforcementService.unblockApps(
          blockedApps.selectionId,
          result.durationMinutes
        );
      }

      return result;
    },
    onSuccess: () => {
      // Refresh enforcement status and allowances
      queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.allowances.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.usage.all });
    },
  });
}
