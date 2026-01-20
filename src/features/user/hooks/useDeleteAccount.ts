import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteAccount,

    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}
