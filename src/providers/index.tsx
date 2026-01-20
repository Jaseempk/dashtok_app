import { ReactNode } from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/lib/storage/secureStore';
import { config } from '@/constants/config';
import { AuthGuard } from '@/features/auth';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  if (!config.clerkPublishableKey) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment');
  }

  return (
    <ClerkProvider
      publishableKey={config.clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <AuthGuard>
          {children}
        </AuthGuard>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
