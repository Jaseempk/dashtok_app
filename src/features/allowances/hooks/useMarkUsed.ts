import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { allowancesApi } from '../api/allowancesApi';
import type { TodayAllowance } from '../types/allowance.types';

export function useMarkUsed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usedMinutes: number) =>
      allowancesApi.updateUsedMinutes({ usedMinutes }),

    // Optimistic update
    onMutate: async (usedMinutes) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.allowances.today() });

      const previousAllowance = queryClient.getQueryData<TodayAllowance>(
        queryKeys.allowances.today()
      );

      if (previousAllowance) {
        queryClient.setQueryData<TodayAllowance>(queryKeys.allowances.today(), {
          ...previousAllowance,
          usedMinutes,
          remainingMinutes: previousAllowance.totalMinutes - usedMinutes,
        });
      }

      return { previousAllowance };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousAllowance) {
        queryClient.setQueryData(queryKeys.allowances.today(), context.previousAllowance);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allowances.all });
    },
  });
}
