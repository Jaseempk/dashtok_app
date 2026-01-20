import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import { api, setAuthTokenGetter } from '@/lib/api/client';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseAuthReturn {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  fetchUserProfile: () => Promise<UserProfile | null>;
}

export function useAuth(): UseAuthReturn {
  const { isLoaded, isSignedIn, userId, signOut: clerkSignOut, getToken } = useClerkAuth();
  const { user } = useUser();

  // Set up the auth token getter for API calls
  setAuthTokenGetter(getToken);

  const signOut = useCallback(async () => {
    try {
      await clerkSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, [clerkSignOut]);

  const fetchUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!isSignedIn) return null;

    try {
      const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }, [isSignedIn]);

  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    userId: userId ?? null,
    userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
    userName: user?.firstName ?? null,
    signOut,
    getToken,
    fetchUserProfile,
  };
}
