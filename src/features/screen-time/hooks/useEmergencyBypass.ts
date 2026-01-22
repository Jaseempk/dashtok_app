import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { enforcementApi } from '../api/enforcementApi';
import { enforcementService } from '../services/enforcementService';
import { useBlockedApps } from './useBlockedApps';

/**
 * Request emergency bypass from server.
 * SECURITY: Server enforces rate limit (max 3 per day).
 */
export function useEmergencyBypass() {
  const queryClient = useQueryClient();
  const { data: blockedApps } = useBlockedApps();

  return useMutation({
    mutationFn: async () => {
      // 1. Request bypass from server (server enforces rate limit)
      const result = await enforcementApi.requestEmergencyBypass();

      // 2. If server grants bypass, temporarily unblock
      if (result.granted && blockedApps?.selectionId && result.minutesGranted) {
        await enforcementService.unblockApps(
          blockedApps.selectionId,
          result.minutesGranted
        );
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
