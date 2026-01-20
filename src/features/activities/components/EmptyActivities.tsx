import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';

interface EmptyActivitiesProps {
  title?: string;
  message?: string;
}

export function EmptyActivities({
  title = 'No activities yet',
  message = 'Start tracking your movement to see your activities here.',
}: EmptyActivitiesProps) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <View className="w-20 h-20 rounded-full bg-background-tertiary items-center justify-center mb-4">
        <Icon name="footsteps" size="3xl" color="#374151" />
      </View>
      <Text className="text-xl font-semibold text-white text-center mb-2">
        {title}
      </Text>
      <Text className="text-sm text-gray-400 text-center">
        {message}
      </Text>
    </View>
  );
}
