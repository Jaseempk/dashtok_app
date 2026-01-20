import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { PermissionRow } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { HEALTH_PERMISSIONS } from '@/features/onboarding/constants/content';

export default function HealthPermissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setHealthConnected } = useOnboardingStore();

  const handleConnect = async () => {
    // TODO: Implement actual HealthKit/Health Connect permission request
    // For now, we simulate success
    setHealthConnected(true);
    router.push('/(onboarding)/notifications');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/notifications');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <Text className="text-gray-400 text-2xl">←</Text>
        </Pressable>
        <Text className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Step 6 of 6
        </Text>
        <Pressable onPress={handleSkip}>
          <Text className="text-primary-500 font-semibold text-sm">Skip</Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6">
        {/* Hero Icon */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-3xl bg-primary-500/10 border border-primary-500/30 items-center justify-center">
            <Text className="text-5xl">❤️</Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Connect your{'\n'}health data
        </Text>
        <Text className="text-base text-gray-400 text-center mb-8">
          We'll sync your activity to track your{'\n'}progress and unlock rewards.
        </Text>

        {/* Permission Rows */}
        <View className="gap-3">
          {HEALTH_PERMISSIONS.map((permission) => (
            <PermissionRow
              key={permission.title}
              icon={permission.icon}
              title={permission.title}
              description={permission.description}
            />
          ))}
        </View>

        {/* Privacy Note */}
        <View className="mt-6 p-4 rounded-xl bg-background-secondary/50">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-primary-500">🔒</Text>
            <Text className="text-sm font-semibold text-white">Your data stays private</Text>
          </View>
          <Text className="text-xs text-gray-400 leading-relaxed">
            We only read what's needed to verify your activity. Your health data is never
            sold or shared with third parties.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View
        className="px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button onPress={handleConnect}>
          Connect Health Data
        </Button>
      </View>
    </View>
  );
}
