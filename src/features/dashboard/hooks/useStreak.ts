import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { dashboardApi } from '../api/dashboardApi';

export function useStreak() {
  return useQuery({
    queryKey: queryKeys.streaks.current(),
    queryFn: dashboardApi.getStreak,
  });
}
