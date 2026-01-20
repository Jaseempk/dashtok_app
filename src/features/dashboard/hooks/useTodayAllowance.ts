import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { dashboardApi } from '../api/dashboardApi';

export function useTodayAllowance() {
  return useQuery({
    queryKey: queryKeys.allowances.today(),
    queryFn: dashboardApi.getTodayAllowance,
  });
}
