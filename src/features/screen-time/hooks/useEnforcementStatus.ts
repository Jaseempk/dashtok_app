import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { enforcementApi } from '../api/enforcementApi';

export function useEnforcementStatus() {
  return useQuery({
    queryKey: queryKeys.enforcement.status(),
    queryFn: enforcementApi.getStatus,
    staleTime: 1000 * 30, // 30 seconds - check frequently for time updates
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}
