import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/tokens';

interface QuickAddButtonsProps {
  currentUsed: number;
  totalAvailable: number;
  onAddMinutes: (minutes: number) => void;
  isLoading?: boolean;
}

const QUICK_ADD_OPTIONS = [
  { label: '+15m', minutes: 15 },
  { label: '+30m', minutes: 30 },
  { label: '+1h', minutes: 60 },
] as const;

export function QuickAddButtons({
  currentUsed,
  totalAvailable,
  onAddMinutes,
  isLoading = false,
}: QuickAddButtonsProps) {
  const handlePress = (minutes: number) => {
    const newUsed = Math.min(currentUsed + minutes, totalAvailable);
    if (newUsed > currentUsed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAddMinutes(newUsed);
    }
  };

  return (
    <View className="bg-background-secondary rounded-xl p-4">
      <Text className="text-sm font-medium text-gray-400 mb-3">Quick Add</Text>
      <View className="flex-row gap-3">
        {QUICK_ADD_OPTIONS.map((option) => {
          const wouldExceed = currentUsed + option.minutes > totalAvailable;
          const remaining = totalAvailable - currentUsed;

          return (
            <Pressable
              key={option.label}
              onPress={() => handlePress(option.minutes)}
              disabled={isLoading || remaining <= 0}
              className={`flex-1 py-3 rounded-lg items-center border ${
                wouldExceed || remaining <= 0
                  ? 'border-border-subtle bg-background-tertiary opacity-50'
                  : 'border-primary-500/30 bg-primary-500/10 active:bg-primary-500/20'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary[500]} />
              ) : (
                <Text
                  className={`font-semibold ${
                    wouldExceed || remaining <= 0 ? 'text-gray-500' : 'text-primary-500'
                  }`}
                >
                  {option.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
      {totalAvailable - currentUsed <= 0 && (
        <Text className="text-xs text-gray-500 text-center mt-2">
          No time remaining. Earn more by completing goals!
        </Text>
      )}
    </View>
  );
}
