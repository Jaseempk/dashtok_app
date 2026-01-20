import { useEffect, useState, ReactNode } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { api, setAuthTokenGetter } from '@/lib/api/client';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  onboardingCompleted: boolean;
}

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  // Check if navigation is ready
  const navigationReady = rootNavigationState?.key != null;

  useEffect(() => {
    console.log('[AuthGuard] Effect triggered:', { isLoaded, isSignedIn, segments: segments[0], hasCheckedProfile, isCheckingProfile, navigationReady });

    if (!isLoaded) {
      console.log('[AuthGuard] Clerk not loaded yet, waiting...');
      return;
    }

    if (!navigationReady) {
      console.log('[AuthGuard] Navigation not ready yet, waiting...');
      return;
    }

    // Set up auth token getter for API calls
    setAuthTokenGetter(getToken);

    const checkAuthAndProfile = async () => {
      const inAuthGroup = segments[0] === '(auth)';
      const inOnboardingGroup = segments[0] === '(onboarding)';
      const inAppGroup = segments[0] === '(app)';

      console.log('[AuthGuard] checkAuthAndProfile:', { inAuthGroup, inOnboardingGroup, inAppGroup, isSignedIn });

      if (!isSignedIn) {
        // Not signed in - redirect to auth unless already there
        if (!inAuthGroup) {
          router.replace('/(auth)/sign-in');
        }
        setHasCheckedProfile(true);
        return;
      }

      // User is signed in - check onboarding status from server
      if (!hasCheckedProfile && !isCheckingProfile) {
        console.log('[AuthGuard] Starting profile check...');
        setIsCheckingProfile(true);

        try {
          console.log('[AuthGuard] Fetching profile from API...');
          const response = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
          console.log('[AuthGuard] Profile response:', response);
          const profile = response.data;

          if (!profile.onboardingCompleted) {
            // Not onboarded - redirect to onboarding
            console.log('[AuthGuard] User not onboarded, redirecting to onboarding');
            if (!inOnboardingGroup) {
              router.replace('/(onboarding)/welcome');
            }
          } else {
            // Fully authenticated and onboarded
            console.log('[AuthGuard] User onboarded, redirecting to app');
            if (inAuthGroup || inOnboardingGroup) {
              router.replace('/(app)/(tabs)');
            }
          }
        } catch (error) {
          // If we can't fetch profile, user might be new (not synced via webhook yet)
          // Redirect to onboarding
          console.error('[AuthGuard] Failed to fetch profile:', error);
          console.log('[AuthGuard] Redirecting to onboarding due to error');
          if (!inOnboardingGroup) {
            router.replace('/(onboarding)/welcome');
          }
        } finally {
          setIsCheckingProfile(false);
          setHasCheckedProfile(true);
        }
      } else if (hasCheckedProfile) {
        // Already checked - handle navigation for signed-in users
        if (inAuthGroup) {
          router.replace('/(app)/(tabs)');
        }
      }
    };

    checkAuthAndProfile();
  }, [isLoaded, isSignedIn, segments, hasCheckedProfile, isCheckingProfile, router, getToken, navigationReady]);

  // Reset profile check when auth state changes (signed in OR signed out)
  useEffect(() => {
    if (isLoaded) {
      console.log('[AuthGuard] Auth state changed, resetting profile check');
      setHasCheckedProfile(false);
    }
  }, [isLoaded, isSignedIn]);

  // Always render children to allow navigation to mount
  // Show loading overlay when Clerk loading OR signed in but profile not checked yet
  const showLoading = !isLoaded || (isSignedIn && !hasCheckedProfile);

  return (
    <>
      {children}
      {showLoading && (
        <View
          className="absolute inset-0 bg-background-primary items-center justify-center"
          style={{ zIndex: 999 }}
        >
          <ActivityIndicator size="large" color="#00f5d4" />
        </View>
      )}
    </>
  );
}
