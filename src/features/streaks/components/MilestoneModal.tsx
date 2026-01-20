import { View, Text, Modal, Pressable } from 'react-native';
import { Icon, Button } from '@/components/ui';
import { colors } from '@/styles/tokens';
import { getStreakTier, isStreakMilestone } from '../types/streak.types';

interface MilestoneModalProps {
  visible: boolean;
  streakDays: number;
  multiplier: number;
  onClose: () => void;
}

function getMilestoneMessage(days: number): string {
  if (days >= 100) return 'LEGENDARY!';
  if (days >= 50) return 'UNSTOPPABLE!';
  if (days >= 30) return 'ON FIRE!';
  if (days >= 14) return 'LEVEL UP!';
  if (days >= 7) return 'AMAZING!';
  return 'GREAT START!';
}

export function MilestoneModal({
  visible,
  streakDays,
  multiplier,
  onClose,
}: MilestoneModalProps) {
  const tier = getStreakTier(streakDays);
  const message = getMilestoneMessage(streakDays);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 items-center justify-center px-6">
        <View className="bg-background-secondary rounded-3xl p-8 w-full max-w-sm items-center">
          {/* Fire Icon with Glow Effect */}
          <View className="mb-4">
            <View
              className="w-32 h-32 rounded-full items-center justify-center"
              style={{
                backgroundColor: `${colors.secondary[500]}20`,
                shadowColor: colors.secondary[500],
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
              }}
            >
              <Icon name="flame" size={64} color={colors.secondary[500]} />
            </View>
          </View>

          {/* Streak Count */}
          <Text className="text-6xl font-bold text-white">{streakDays}</Text>
          <Text className="text-lg text-gray-400 mt-1">DAY STREAK!</Text>

          {/* Message */}
          <View className="bg-secondary-500 px-6 py-2 rounded-full mt-4">
            <Text className="text-xl font-bold text-black">{message}</Text>
          </View>

          {/* Multiplier Info */}
          {multiplier > 1 && (
            <View className="mt-6 items-center">
              <Text className="text-sm text-gray-400">You now earn</Text>
              <Text className="text-3xl font-bold text-primary-500">{multiplier}x</Text>
              <Text className="text-sm text-gray-400">bonus minutes</Text>
            </View>
          )}

          {/* Tier Badge */}
          <View
            className="mt-4 px-4 py-2 rounded-full"
            style={{ backgroundColor: `${tier.color}20` }}
          >
            <Text style={{ color: tier.color }} className="text-sm font-semibold">
              {tier.name} Streak Achieved
            </Text>
          </View>

          {/* CTA Button */}
          <View className="w-full mt-8">
            <Button onPress={onClose} icon="flame">
              Keep it burning!
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Hook to determine if milestone modal should show
export function useMilestoneCheck(previousDays: number | null, currentDays: number): {
  shouldShowMilestone: boolean;
  milestoneDays: number;
} {
  // Show milestone if we crossed a milestone threshold
  if (previousDays === null) {
    return { shouldShowMilestone: false, milestoneDays: 0 };
  }

  if (currentDays > previousDays && isStreakMilestone(currentDays)) {
    return { shouldShowMilestone: true, milestoneDays: currentDays };
  }

  return { shouldShowMilestone: false, milestoneDays: 0 };
}
