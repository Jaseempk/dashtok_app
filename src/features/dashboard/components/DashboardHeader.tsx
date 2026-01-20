import { View, Text, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Icon } from '@/components/ui';

interface DashboardHeaderProps {
  userName?: string;
  onSettingsPress?: () => void;
}

export function DashboardHeader({ userName = 'there', onSettingsPress }: DashboardHeaderProps) {
  const now = new Date();
  const dateString = format(now, 'EEEE, MMM d').toUpperCase();
  const hour = now.getHours();

  // Determine greeting based on time of day
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        {/* Avatar placeholder */}
        <View className="w-12 h-12 rounded-full bg-background-tertiary border-2 border-primary-500/30 items-center justify-center">
          <Icon name="person" size="lg" color="#9ca3af" />
        </View>

        {/* Date and greeting */}
        <View>
          <Text className="text-xs font-medium text-gray-400 tracking-wide">
            {dateString}
          </Text>
          <Text className="text-lg font-semibold text-white">
            {greeting}, {userName}
          </Text>
        </View>
      </View>

      {/* Settings button */}
      <Pressable
        onPress={onSettingsPress}
        className="w-11 h-11 rounded-full bg-background-secondary items-center justify-center active:bg-background-tertiary"
      >
        <Icon name="settings" size="md" color="#00f5d4" />
      </Pressable>
    </View>
  );
}
