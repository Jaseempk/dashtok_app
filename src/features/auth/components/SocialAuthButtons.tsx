import { useState, useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

// Required for OAuth redirect handling
WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = 'oauth_google' | 'oauth_apple';

interface SocialButtonProps {
  provider: 'google' | 'apple';
  onPress: () => void;
  isLoading: boolean;
}

function SocialButton({ provider, onPress, isLoading }: SocialButtonProps) {
  const isGoogle = provider === 'google';

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={`flex-1 h-14 rounded-xl border border-border-default items-center justify-center flex-row gap-2 ${
        isLoading ? 'opacity-50' : 'active:bg-background-tertiary'
      }`}
    >
      <Text className="text-xl">{isGoogle ? '🔵' : '🍎'}</Text>
      <Text className="text-white font-medium">
        {isGoogle ? 'Google' : 'Apple'}
      </Text>
    </Pressable>
  );
}

export function SocialAuthButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState('');

  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });

  const handleOAuthSignIn = useCallback(
    async (strategy: OAuthStrategy) => {
      setError('');
      setIsLoading(strategy);

      try {
        const startOAuth = strategy === 'oauth_google' ? startGoogleOAuth : startAppleOAuth;
        const { createdSessionId, setActive } = await startOAuth();

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace('/');
        }
      } catch (err: unknown) {
        const oauthError = err as { errors?: Array<{ message: string }> };
        const message = oauthError.errors?.[0]?.message || 'OAuth sign in failed';
        setError(message);
        console.error('OAuth error:', err);
      } finally {
        setIsLoading(null);
      }
    },
    [startGoogleOAuth, startAppleOAuth, router]
  );

  // Only show Apple on iOS
  const showApple = Platform.OS === 'ios';

  return (
    <View>
      <View className={`flex-row gap-4 ${!showApple ? 'justify-center' : ''}`}>
        <SocialButton
          provider="google"
          onPress={() => handleOAuthSignIn('oauth_google')}
          isLoading={isLoading === 'oauth_google'}
        />
        {showApple && (
          <SocialButton
            provider="apple"
            onPress={() => handleOAuthSignIn('oauth_apple')}
            isLoading={isLoading === 'oauth_apple'}
          />
        )}
      </View>
      {error ? (
        <Text className="text-red-500 text-sm text-center mt-2">{error}</Text>
      ) : null}
    </View>
  );
}
