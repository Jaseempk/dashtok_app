import { useState } from 'react';
import { View, Text, Pressable, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { NOTIFICATION_TYPES } from '@/features/onboarding/constants/content';
import { useNotificationPermission, notificationService } from '@/features/notifications';
import { api } from '@/lib/api/client';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setNotificationsEnabled, setNotificationPreference } = useOnboardingStore();
  const { requestPermission, isLoading } = useNotificationPermission();

  // Local state for toggles (will be sent to server on enable)
  const [dailyReminders, setDailyReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const handleEnable = async () => {
    try {
      // Request OS permission
      const granted = await requestPermission();

      if (granted) {
        // Update server with notification preferences
        await api.patch('/users/me', {
          notificationsEnabled: true,
          dailyReminderEnabled: dailyReminders,
          streakAlertsEnabled: streakAlerts,
          weeklySummaryEnabled: weeklySummary,
        });

        // Update local onboarding store
        setNotificationsEnabled(true);
        setNotificationPreference('dailyReminders', dailyReminders);
        setNotificationPreference('streakAlerts', streakAlerts);
        setNotificationPreference('weeklySummary', weeklySummary);

        // Schedule notifications based on preferences
        await notificationService.updateSchedule({
          notificationsEnabled: true,
          dailyReminderEnabled: dailyReminders,
          dailyReminderTime: '08:00',
          streakAlertsEnabled: streakAlerts,
          weeklySummaryEnabled: weeklySummary,
        });
      } else {
        // Permission denied - still continue but note it
        Alert.alert(
          'Notifications Disabled',
          'You can enable notifications later in Settings.',
          [{ text: 'OK' }]
        );
      }

      router.push('/(onboarding)/complete');
    } catch (error) {
      console.error('[Notifications] Enable error:', error);
      // Continue anyway - don't block onboarding
      router.push('/(onboarding)/complete');
    }
  };

  const handleSkip = () => {
    setNotificationsEnabled(false);
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
      <View className="flex-row items-center px-6 py-4">
        <Pressable
          onPress={handleBack}
          className="w-11 h-11 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <Icon name="arrow-back" size="lg" color="#9ca3af" />
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
        <Text className="text-3xl font-bold text-white text-center mb-2 tracking-wider">
          STAY ON TRACK
        </Text>
        <Text className="text-base text-gray-400 text-center mb-8">
          Quick reminders help you hit your goals and{'\n'}keep the streak alive.
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

        {/* Notification Toggle Options */}
        <View className="mt-6 gap-2">
          {/* Daily Reminders */}
          <View className="flex-row items-center justify-between p-4 rounded-xl bg-background-secondary border border-border-subtle">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-lg bg-background-tertiary items-center justify-center">
                <Icon name="calendar" size="sm" color="#9ca3af" />
              </View>
              <Text className="text-sm font-medium text-white">Daily Reminders</Text>
            </View>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: '#374151', true: '#00f5d4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Streak Alerts */}
          <View className="flex-row items-center justify-between p-4 rounded-xl bg-background-secondary border border-border-subtle">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-lg bg-background-tertiary items-center justify-center">
                <Icon name="flash" size="sm" color="#9ca3af" />
              </View>
              <Text className="text-sm font-medium text-white">Streak Alerts</Text>
            </View>
            <Switch
              value={streakAlerts}
              onValueChange={setStreakAlerts}
              trackColor={{ false: '#374151', true: '#00f5d4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Weekly Summary */}
          <View className="flex-row items-center justify-between p-4 rounded-xl bg-background-secondary border border-border-subtle">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-lg bg-background-tertiary items-center justify-center">
                <Icon name="stats-chart" size="sm" color="#9ca3af" />
              </View>
              <Text className="text-sm font-medium text-white">Weekly Summary</Text>
            </View>
            <Switch
              value={weeklySummary}
              onValueChange={setWeeklySummary}
              trackColor={{ false: '#374151', true: '#00f5d4' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View
        className="px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button onPress={handleEnable} isLoading={isLoading} disabled={isLoading}>
          Enable Notifications
        </Button>
        <Pressable onPress={handleSkip} className="mt-3 py-2" disabled={isLoading}>
          <Text className="text-gray-500 text-center text-sm">Maybe later</Text>
        </Pressable>
      </View>
    </View>
  );
}
