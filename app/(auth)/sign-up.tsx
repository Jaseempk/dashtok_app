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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { AuthInput } from '@/components/auth';

export default function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        firstName: username.trim(), // Username stored as firstName
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Navigate to verification screen with email
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email },
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message = clerkError.errors?.[0]?.message || 'Failed to create account';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signUp, username, email, password, router]);

  const isFormValid = username.trim() !== '' && email.trim() !== '' && password.length >= 8;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-primary"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Link href="/(auth)/sign-in" asChild>
            <Pressable className="w-10 h-10 rounded-full bg-background-tertiary items-center justify-center">
              <Icon name="arrow-back" size="md" color="#ffffff" />
            </Pressable>
          </Link>
          <Text className="text-xs text-primary-500 font-medium tracking-widest uppercase">
            Elite Access
          </Text>
        </View>

        {/* Hero Text */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white">Start Your</Text>
          <Text className="text-4xl font-bold text-primary-500 italic">Journey</Text>
          <Text className="text-base text-gray-400 mt-2">Turn movement into reward</Text>
        </View>

        {/* Form Card */}
        <View className="bg-background-secondary/60 border border-primary-500/20 rounded-2xl p-5 mb-6">
          <View className="gap-5">
            <AuthInput
              label="Identity"
              icon="person"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <AuthInput
              label="Communications"
              icon="mail"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />

            <AuthInput
              label="Security"
              icon="lock"
              placeholder="Password (min 8 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
            />
          </View>

          {error ? (
            <Text className="text-red-500 text-sm mt-3 text-center">{error}</Text>
          ) : null}

          <View className="mt-6">
            <Button
              onPress={handleCreateAccount}
              isLoading={isLoading}
              disabled={!isFormValid}
              icon="sparkles"
            >
              Create Account
            </Button>
          </View>
        </View>

        {/* Sign In Link */}
        <View className="flex-row justify-center mb-6">
          <Text className="text-gray-400">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text className="text-primary-500 font-semibold">Sign In</Text>
            </Pressable>
          </Link>
        </View>

        {/* Terms */}
        <Text className="text-xs text-gray-500 text-center leading-5">
          By proceeding, you agree to our{' '}
          <Text className="text-gray-400 underline">Terms of Service</Text>
          {' & '}
          <Text className="text-gray-400 underline">Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
