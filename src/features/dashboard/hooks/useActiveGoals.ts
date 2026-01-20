import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { dashboardApi } from '../api/dashboardApi';

export function useActiveGoals() {
  return useQuery({
    queryKey: queryKeys.goals.active(),
    queryFn: dashboardApi.getActiveGoals,
  });
}
