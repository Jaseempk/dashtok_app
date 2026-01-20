import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { SOLUTION_PILLARS } from '@/features/onboarding/constants/content';

export default function SolutionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.push('/(onboarding)/activity-type');
  };

  return (
    <View
      className="flex-1 bg-background-primary justify-between"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Content */}
      <View className="flex-1 px-6 pt-12">
        {/* Title */}
        <Text className="text-4xl font-bold text-white text-center mb-3">
          Your Dashtok{'\n'}Strategy
        </Text>
        <Text className="text-base text-gray-400 text-center mb-10">
          Based on your profile, here's how{'\n'}we'll help you succeed.
        </Text>

        {/* Pillar Cards */}
        <View className="gap-4">
          {SOLUTION_PILLARS.map((pillar) => (
            <View
              key={pillar.title}
              className="flex-row items-center gap-4 p-5 rounded-2xl bg-background-secondary border border-border-subtle"
            >
              {/* Icon */}
              <View className="w-14 h-14 rounded-full bg-primary-500/10 border border-primary-500/30 items-center justify-center">
                <Text className="text-2xl">{pillar.icon}</Text>
              </View>

              {/* Text */}
              <View className="flex-1">
                <Text className="text-lg font-semibold text-white mb-1">
                  {pillar.title}
                </Text>
                <Text className="text-sm text-gray-400 leading-relaxed">
                  {pillar.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 pb-4">
        <Button onPress={handleContinue}>
          Set up my first goal
        </Button>
      </View>
    </View>
  );
}
