import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { blockedAppsApi } from '../api/blockedAppsApi';

export function useBlockedApps() {
  return useQuery({
    queryKey: queryKeys.blockedApps.current(),
    queryFn: blockedAppsApi.getBlockedApps,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
