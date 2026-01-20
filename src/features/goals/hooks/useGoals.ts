import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { goalsApi } from '../api/goalsApi';

export function useGoals(activeOnly = false) {
  return useQuery({
    queryKey: queryKeys.goals.list(activeOnly),
    queryFn: () => goalsApi.getGoals(activeOnly),
  });
}
