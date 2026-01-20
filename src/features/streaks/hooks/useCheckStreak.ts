import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { streaksApi } from '../api/streaksApi';

export function useCheckStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: streaksApi.checkStreak,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.streaks.current(), data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks.all });
    },
  });
}
