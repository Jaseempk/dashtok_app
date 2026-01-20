import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { dashboardApi } from '../api/dashboardApi';

export function useTodayStats() {
  return useQuery({
    queryKey: queryKeys.activities.today(),
    queryFn: dashboardApi.getTodayStats,
  });
}
