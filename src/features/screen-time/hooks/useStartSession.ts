import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { usageApi } from '../api/usageApi';
import type { StartSessionInput } from '../types/screenTime.types';

export function useStartSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartSessionInput) => usageApi.startSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usage.all });
    },
  });
}
