import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui';

interface OnboardingHeaderProps {
  step?: number;
  total?: number;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function OnboardingHeader({
  step,
  total,
  showBack = true,
  rightElement,
}: OnboardingHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <Icon name="arrow-back" size="lg" color="#9ca3af" />
        </Pressable>
      ) : (
        <View className="w-11" />
      )}

      {step && total ? (
        <Text className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
          Step {step} of {total}
        </Text>
      ) : (
        <View />
      )}

      {rightElement ?? <View className="w-11" />}
    </View>
  );
}
