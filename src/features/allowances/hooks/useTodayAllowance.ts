import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { allowancesApi } from '../api/allowancesApi';

export function useTodayAllowance() {
  return useQuery({
    queryKey: queryKeys.allowances.today(),
    queryFn: allowancesApi.getTodayAllowance,
    staleTime: 1000 * 60, // 1 minute
  });
}
