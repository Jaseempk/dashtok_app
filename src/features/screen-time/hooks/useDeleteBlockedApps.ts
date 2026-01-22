import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { blockedAppsApi } from '../api/blockedAppsApi';

export function useDeleteBlockedApps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => blockedAppsApi.deleteBlockedApps(),
    onSuccess: () => {
      // Invalidate blocked apps and enforcement status
      queryClient.invalidateQueries({ queryKey: queryKeys.blockedApps.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
    },
  });
}
