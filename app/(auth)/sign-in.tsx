import { useState, useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { Button, Input } from '@/components/ui';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (!isLoaded || !signIn) return;

    setError('');
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      } else {
        // Handle other statuses (e.g., needs_first_factor, needs_second_factor)
        console.log('Sign in status:', result.status);
        setError('Additional verification required');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message = clerkError.errors?.[0]?.message || 'Failed to sign in';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signIn, email, password, setActive, router]);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-primary"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white mb-2">Welcome back</Text>
          <Text className="text-base text-gray-400">
            Sign in to continue your journey
          </Text>
        </View>

        <View className="gap-4 mb-6">
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />

          {error ? (
            <Text className="text-red-500 text-sm ml-1">{error}</Text>
          ) : null}
        </View>

        <Button
          onPress={handleSignIn}
          isLoading={isLoading}
          disabled={!isFormValid}
        >
          Sign In
        </Button>

        <View className="my-8 flex-row items-center">
          <View className="flex-1 h-px bg-border-subtle" />
          <Text className="mx-4 text-gray-500 text-sm">or continue with</Text>
          <View className="flex-1 h-px bg-border-subtle" />
        </View>

        <SocialAuthButtons />

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-400">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text className="text-primary-500 font-semibold">Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
