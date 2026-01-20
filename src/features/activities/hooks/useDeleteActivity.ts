import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { activitiesApi } from '../api/activitiesApi';

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activitiesApi.deleteActivity(id),
    onSuccess: () => {
      // Invalidate all activity-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      // Also invalidate dashboard data since allowances may have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.allowances.today() });
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks.current() });
    },
  });
}
