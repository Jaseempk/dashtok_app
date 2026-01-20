import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { ActivityTypeCard } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { ACTIVITY_OPTIONS } from '@/features/onboarding/constants/content';

export default function ActivityTypeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activityType, setActivityType } = useOnboardingStore();

  const handleContinue = () => {
    if (activityType) {
      router.push('/(onboarding)/daily-target');
    }
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
        <Text className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Step 4 of 6
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="text-3xl font-bold text-white mb-2">
          What's your preferred{'\n'}activity?
        </Text>
        <Text className="text-base text-gray-400 mb-8">
          Choose your main movement type. You can always{'\n'}change this later.
        </Text>

        {/* Activity Cards */}
        <View className="gap-4">
          {ACTIVITY_OPTIONS.map((option) => (
            <ActivityTypeCard
              key={option.type}
              type={option.type}
              title={option.title}
              badge={option.badge}
              reward={option.reward}
              emoji={option.emoji}
              selected={activityType === option.type}
              onPress={() => setActivityType(option.type)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button onPress={handleContinue} disabled={!activityType}>
          Continue
        </Button>
      </View>
    </View>
  );
}
