import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { usageApi } from '../api/usageApi';
import type { EndSessionInput } from '../types/screenTime.types';

export function useEndSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EndSessionInput) => usageApi.endSession(data),
    onSuccess: () => {
      // Refresh usage, enforcement, and allowances
      queryClient.invalidateQueries({ queryKey: queryKeys.usage.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.allowances.all });
    },
  });
}
