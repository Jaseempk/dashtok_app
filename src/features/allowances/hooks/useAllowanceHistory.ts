import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { allowancesApi } from '../api/allowancesApi';
import type { AllowanceHistoryFilters } from '../types/allowance.types';

export function useAllowanceHistory(filters?: AllowanceHistoryFilters) {
  return useQuery({
    queryKey: queryKeys.allowances.history({ days: filters?.limit }),
    queryFn: () => allowancesApi.getHistory(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
