import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { activitiesApi } from '../api/activitiesApi';

export function useActivity(id: string) {
  return useQuery({
    queryKey: queryKeys.activities.detail(id),
    queryFn: () => activitiesApi.getActivity(id),
    enabled: !!id,
  });
}
