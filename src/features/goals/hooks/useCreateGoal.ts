import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { goalsApi } from '../api/goalsApi';
import type { CreateGoalInput } from '../types/goal.types';

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalInput) => goalsApi.createGoal(data),
    onSuccess: () => {
      // Invalidate goals list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
