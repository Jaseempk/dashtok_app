import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { goalsApi } from '../api/goalsApi';
import type { Goal, UpdateGoalInput } from '../types/goal.types';

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalInput }) =>
      goalsApi.updateGoal(id, data),

    // Optimistic update - instant UI feedback
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.goals.all });

      // Snapshot previous value
      const previousGoals = queryClient.getQueryData<Goal[]>(queryKeys.goals.list(false));

      // Optimistically update cache
      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(
          queryKeys.goals.list(false),
          previousGoals.map((goal) =>
            goal.id === id ? { ...goal, ...data } : goal
          )
        );
      }

      return { previousGoals };
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(queryKeys.goals.list(false), context.previousGoals);
      }
    },

    // Refetch after success or error to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
