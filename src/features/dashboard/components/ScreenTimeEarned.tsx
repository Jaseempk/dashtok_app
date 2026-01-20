import { View, Text } from 'react-native';

interface ScreenTimeEarnedProps {
  earnedMinutes: number;
  targetMinutes: number;
}

export function ScreenTimeEarned({ earnedMinutes, targetMinutes }: ScreenTimeEarnedProps) {
  return (
    <View>
      <View className="flex-row items-baseline">
        <Text className="text-lg font-semibold text-primary-500">= </Text>
        <Text className="text-lg font-semibold text-primary-500">{earnedMinutes}</Text>
        <Text className="text-lg text-gray-400"> / {targetMinutes} min</Text>
      </View>
      <Text className="text-xs text-gray-500">Screen time earned</Text>
    </View>
  );
}
