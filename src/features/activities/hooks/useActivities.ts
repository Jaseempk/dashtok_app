import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { activitiesApi } from '../api/activitiesApi';
import type { ActivityFilters } from '../types/activity.types';

export function useActivities(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: queryKeys.activities.list(filters),
    queryFn: () => activitiesApi.getActivities(filters),
  });
}
