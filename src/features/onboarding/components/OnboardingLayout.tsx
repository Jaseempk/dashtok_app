import { ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { useFadeIn } from '@/lib/animations';

interface OnboardingLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  skipTopInset?: boolean; // When layout handles progress bar with safe area
  showSkip?: boolean;
  onSkip?: () => void;
  primaryButtonText?: string;
  primaryButtonDisabled?: boolean;
  primaryButtonLoading?: boolean;
  onPrimaryPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  hideFooter?: boolean;
}

export function OnboardingLayout({
  children,
  showBackButton = true,
  skipTopInset = false,
  showSkip = false,
  onSkip,
  primaryButtonText = 'Continue',
  primaryButtonDisabled = false,
  primaryButtonLoading = false,
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
  hideFooter = false,
}: OnboardingLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeInStyle = useFadeIn({ duration: 350, translateY: 15 });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-primary"
    >
      <View
        className="flex-1"
        style={{ paddingTop: skipTopInset ? 0 : insets.top }}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            {showBackButton ? (
              <Pressable
                onPress={() => router.back()}
                className="w-11 h-11 items-center justify-center rounded-full active:bg-background-secondary"
              >
                <Icon name="arrow-back" size="lg" color="#9ca3af" />
              </Pressable>
            ) : (
              <View className="w-11" />
            )}

            {showSkip ? (
              <Pressable onPress={onSkip} className="px-2 py-1">
                <Text className="text-primary-500 font-semibold text-sm">Skip</Text>
              </Pressable>
            ) : (
              <View className="w-11" />
            )}
          </View>
        </View>

        {/* Content */}
        <Animated.ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-32"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={fadeInStyle}
        >
          {children}
        </Animated.ScrollView>

        {/* Footer */}
        {!hideFooter && (
          <View
            className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-background-primary"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            {/* Gradient overlay */}
            <View className="absolute top-0 left-0 right-0 h-8 -translate-y-full bg-gradient-to-t from-background-primary to-transparent" />

            {onPrimaryPress && (
              <Button
                onPress={onPrimaryPress}
                disabled={primaryButtonDisabled}
                isLoading={primaryButtonLoading}
              >
                {primaryButtonText}
              </Button>
            )}

            {secondaryButtonText && onSecondaryPress && (
              <Pressable
                onPress={onSecondaryPress}
                className="mt-3 py-2 items-center"
              >
                <Text className="text-gray-400 text-sm font-medium">
                  {secondaryButtonText}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
