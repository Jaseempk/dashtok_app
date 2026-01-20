import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { userApi } from '../api/userApi';
import type { User, UpdateUserInput } from '../types/user.types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => userApi.updateProfile(data),

    // Optimistic update
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.user.profile() });

      const previousProfile = queryClient.getQueryData<User>(queryKeys.user.profile());

      if (previousProfile) {
        queryClient.setQueryData<User>(queryKeys.user.profile(), {
          ...previousProfile,
          ...data,
        });
      }

      return { previousProfile };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.user.profile(), context.previousProfile);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
}
