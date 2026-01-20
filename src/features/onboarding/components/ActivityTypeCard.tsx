import { View, Text, Pressable } from 'react-native';
import { ActivityType } from '../store/onboardingStore';

interface ActivityTypeCardProps {
  type: ActivityType;
  title: string;
  badge: string;
  reward: string;
  emoji: string;
  selected: boolean;
  onPress: () => void;
}

export function ActivityTypeCard({
  title,
  badge,
  reward,
  emoji,
  selected,
  onPress,
}: ActivityTypeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border overflow-hidden active:scale-[0.98] ${
        selected
          ? 'border-primary-500 bg-primary-500/5'
          : 'border-border-subtle bg-background-secondary'
      }`}
    >
      {/* Image placeholder */}
      <View className="h-32 bg-background-tertiary items-center justify-center relative">
        {/* Activity icon in top-left */}
        <View className="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary-500/20 items-center justify-center">
          <Text className="text-lg">{emoji}</Text>
        </View>
        <Text className="text-5xl">{emoji}</Text>
      </View>

      {/* Content */}
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-lg font-semibold text-white">{title}</Text>
          {/* Selection indicator */}
          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              selected
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-500'
            }`}
          >
            {selected && (
              <Text className="text-background-primary text-xs font-bold">✓</Text>
            )}
          </View>
        </View>

        {/* Badge */}
        <View className="self-start px-2 py-1 rounded bg-primary-500/20 mb-2">
          <Text className="text-primary-500 text-[10px] font-semibold tracking-wider uppercase">
            {badge}
          </Text>
        </View>

        {/* Reward */}
        <View className="flex-row items-center gap-1">
          <Text className="text-gray-400">⏱️</Text>
          <Text className="text-gray-400 text-sm">
            Earn <Text className="text-primary-500 font-medium">{reward}</Text> screen time
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
