import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { blockedAppsApi } from '../api/blockedAppsApi';
import type { UpdateBlockedAppsInput } from '../types/screenTime.types';

export function useUpdateBlockedApps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBlockedAppsInput) => blockedAppsApi.updateBlockedApps(data),
    onSuccess: () => {
      // Invalidate blocked apps and enforcement status
      queryClient.invalidateQueries({ queryKey: queryKeys.blockedApps.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
    },
  });
}
