import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { OtpInput } from '@/components/auth';
import { colors } from '@/styles/tokens';

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

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
    if (!isLoaded || !signUp || resendCooldown > 0) return;

    setError('');
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message = clerkError.errors?.[0]?.message || 'Failed to resend code';
      setError(message);
    }
  }, [isLoaded, signUp, resendCooldown]);

  const isCodeValid = code.length === 6;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        <View className="flex-row items-center justify-between mb-12">
          <Link href="/(auth)/sign-up" asChild>
            <Pressable className="w-10 h-10 rounded-full bg-background-tertiary items-center justify-center">
              <Icon name="arrow-back" size="md" color="#ffffff" />
            </Pressable>
          </Link>
          <Text className="text-xs text-primary-500 font-medium tracking-widest uppercase">
            Dashtok Elite
          </Text>
        </View>

        {/* Shield Icon */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primary-500/20 items-center justify-center">
            <View className="w-14 h-14 rounded-full bg-primary-500/30 items-center justify-center">
              <Icon name="shield-check" size="xl" color={colors.primary[500]} />
            </View>
          </View>
        </View>

        {/* Title */}
        <View className="items-center mb-2">
          <Text className="text-3xl font-bold text-white">Verify Your</Text>
          <Text className="text-3xl font-bold text-primary-500 italic">Identity</Text>
        </View>

        {/* Subtitle */}
        <Text className="text-base text-gray-400 text-center mb-10">
          We've sent a 6-digit code to your{'\n'}
          elite access email.
        </Text>

        {/* OTP Input */}
        <View className="mb-6">
          <OtpInput value={code} onChange={setCode} />
        </View>

        {/* Timer */}
        {resendCooldown > 0 && (
          <View className="flex-row items-center justify-center mb-4">
            <View className="bg-background-tertiary rounded-full px-4 py-2 flex-row items-center gap-2">
              <Icon name="time" size="sm" color={colors.text.muted} />
              <Text className="text-sm text-gray-400">
                Resend code in {formatTime(resendCooldown)}
              </Text>
            </View>
          </View>
        )}

        {/* Resend Link */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-gray-400">Didn't receive the code? </Text>
          <Pressable onPress={handleResendCode} disabled={resendCooldown > 0}>
            <Text
              className={`font-semibold ${
                resendCooldown > 0 ? 'text-gray-500' : 'text-primary-500'
              }`}
            >
              Resend
            </Text>
          </Pressable>
        </View>

        {error ? (
          <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
        ) : null}

        {/* Verify Button */}
        <Button
          onPress={handleVerifyEmail}
          isLoading={isLoading}
          disabled={!isCodeValid}
          icon="sparkles"
        >
          Verify & Continue
        </Button>

        {/* Security Notice */}
        <View className="flex-row items-center justify-center mt-8 gap-2">
          <Icon name="lock" size="xs" color={colors.text.muted} />
          <Text className="text-xs text-gray-500 uppercase tracking-wider">
            End-to-end encrypted session
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
