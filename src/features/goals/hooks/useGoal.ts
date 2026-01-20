import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { goalsApi } from '../api/goalsApi';

export function useGoal(id: string) {
  return useQuery({
    queryKey: queryKeys.goals.detail(id),
    queryFn: () => goalsApi.getGoal(id),
    enabled: !!id,
  });
}
