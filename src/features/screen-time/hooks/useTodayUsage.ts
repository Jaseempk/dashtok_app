import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { usageApi } from '../api/usageApi';

export function useTodayUsage() {
  return useQuery({
    queryKey: queryKeys.usage.today(),
    queryFn: usageApi.getTodayUsage,
    staleTime: 1000 * 60, // 1 minute
  });
}
