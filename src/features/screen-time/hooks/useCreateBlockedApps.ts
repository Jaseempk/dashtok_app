import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { blockedAppsApi } from '../api/blockedAppsApi';
import type { CreateBlockedAppsInput } from '../types/screenTime.types';

export function useCreateBlockedApps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlockedAppsInput) => blockedAppsApi.createBlockedApps(data),
    onSuccess: () => {
      // Invalidate blocked apps and enforcement status
      queryClient.invalidateQueries({ queryKey: queryKeys.blockedApps.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
    },
  });
}
