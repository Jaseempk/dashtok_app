import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { activitiesApi } from '../api/activitiesApi';
import type { CreateActivityInput } from '../types/activity.types';

export function useLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityInput) => activitiesApi.createActivity(data),
    onSuccess: () => {
      // Invalidate all activity-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      // Also invalidate dashboard data since allowances/streaks may have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.allowances.today() });
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks.current() });
    },
  });
}
