import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { goalsApi } from '../api/goalsApi';

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      // Invalidate goals list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}
