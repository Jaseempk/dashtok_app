import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { NOTIFICATION_TYPES } from '@/features/onboarding/constants/content';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setNotificationsEnabled } = useOnboardingStore();

  const handleEnable = async () => {
    // TODO: Implement actual push notification permission request
    setNotificationsEnabled(true);
    router.push('/(onboarding)/complete');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/complete');
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
          className="w-11 h-11 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <Icon name="arrow-back" size="lg" color="#9ca3af" />
        </Pressable>
        <View className="w-10" />
        <Pressable onPress={handleSkip}>
          <Text className="text-primary-500 font-semibold text-sm">Skip</Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6">
        {/* Hero Icon */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-3xl bg-primary-500/10 border border-primary-500/30 items-center justify-center">
            <Icon name="bell" size="3xl" color="#00f5d4" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Stay on track with{'\n'}smart reminders
        </Text>
        <Text className="text-base text-gray-400 text-center mb-8">
          Get nudges when you're close to your goal{'\n'}or at risk of breaking your streak.
        </Text>

        {/* Notification Preview Cards */}
        <View className="gap-3">
          {NOTIFICATION_TYPES.map((notification, index) => (
            <View
              key={notification.title}
              className="flex-row items-center gap-4 p-4 rounded-xl bg-background-secondary border border-border-subtle"
              style={{ opacity: index === 0 ? 1 : 0.7 }}
            >
              {/* Icon */}
              <View className="w-10 h-10 rounded-xl bg-background-tertiary items-center justify-center">
                <Icon name={notification.icon} size="md" color="#00f5d4" />
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-0.5">
                  <Text className="text-sm font-semibold text-white">
                    {notification.title}
                  </Text>
                  <Text className="text-xs text-gray-500">{notification.time}</Text>
                </View>
                <Text className="text-sm text-gray-400" numberOfLines={1}>
                  {notification.preview}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Frequency Note */}
        <View className="mt-6 items-center">
          <Text className="text-xs text-gray-500">
            Maximum 3 notifications per day
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View
        className="px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button onPress={handleEnable}>
          Enable Notifications
        </Button>
      </View>
    </View>
  );
}
