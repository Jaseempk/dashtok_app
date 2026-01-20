import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { streaksApi } from '../api/streaksApi';

export function useStreak() {
  return useQuery({
    queryKey: queryKeys.streaks.current(),
    queryFn: streaksApi.getStreak,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
