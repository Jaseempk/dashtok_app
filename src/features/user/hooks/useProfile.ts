import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { userApi } from '../api/userApi';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: userApi.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
