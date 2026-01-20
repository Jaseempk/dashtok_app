import { useState, useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { Button, Input } from '@/components/ui';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';

type SignUpStep = 'credentials' | 'verification';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<SignUpStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = useCallback(async () => {
    if (!isLoaded || !signUp) return;

    setError('');
    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verification');
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message = clerkError.errors?.[0]?.message || 'Failed to create account';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signUp, email, password]);

  const handleVerifyEmail = useCallback(async () => {
    if (!isLoaded || !signUp) return;

    setError('');
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message = clerkError.errors?.[0]?.message || 'Invalid verification code';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signUp, code, setActive, router]);

  const handleResendCode = useCallback(async () => {
    if (!isLoaded || !signUp) return;

    setError('');
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setError(''); // Clear any previous error
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message = clerkError.errors?.[0]?.message || 'Failed to resend code';
      setError(message);
    }
  }, [isLoaded, signUp]);

  const isCredentialsValid = email.trim() !== '' && password.length >= 8;
  const isCodeValid = code.length === 6;

  if (step === 'verification') {
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
            <Text className="text-4xl font-bold text-white mb-2">Verify email</Text>
            <Text className="text-base text-gray-400">
              We sent a 6-digit code to {email}
            </Text>
          </View>

          <View className="gap-4 mb-6">
            <Input
              label="Verification Code"
              placeholder="000000"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            {error ? (
              <Text className="text-red-500 text-sm ml-1">{error}</Text>
            ) : null}
          </View>

          <Button
            onPress={handleVerifyEmail}
            isLoading={isLoading}
            disabled={!isCodeValid}
          >
            Verify Email
          </Button>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-400">Didn't receive the code? </Text>
            <Pressable onPress={handleResendCode}>
              <Text className="text-primary-500 font-semibold">Resend</Text>
            </Pressable>
          </View>

          <View className="flex-row justify-center mt-4">
            <Pressable onPress={() => setStep('credentials')}>
              <Text className="text-gray-500">Back to sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
          <Text className="text-4xl font-bold text-white mb-2">Create account</Text>
          <Text className="text-base text-gray-400">
            Start earning screen time with movement
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
            placeholder="At least 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
          />

          {error ? (
            <Text className="text-red-500 text-sm ml-1">{error}</Text>
          ) : null}
        </View>

        <Button
          onPress={handleCreateAccount}
          isLoading={isLoading}
          disabled={!isCredentialsValid}
        >
          Create Account
        </Button>

        <View className="my-8 flex-row items-center">
          <View className="flex-1 h-px bg-border-subtle" />
          <Text className="mx-4 text-gray-500 text-sm">or continue with</Text>
          <View className="flex-1 h-px bg-border-subtle" />
        </View>

        <SocialAuthButtons />

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-400">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text className="text-primary-500 font-semibold">Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
