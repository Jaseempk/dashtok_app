import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { blockedAppsApi } from '../api/blockedAppsApi';

export function useCancelPendingChanges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => blockedAppsApi.cancelPendingChanges(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blockedApps.all });
    },
  });
}
