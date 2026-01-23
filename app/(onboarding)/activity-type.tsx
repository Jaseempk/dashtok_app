import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { ActivityTypeCard } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { ACTIVITY_OPTIONS } from '@/features/onboarding/constants/content';

const TOTAL_STEPS = 6;
const CURRENT_STEP = 5;

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
        <Text className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </Text>
        <View className="w-11" />
      </View>

      {/* Progress Bar */}
      <View className="flex-row items-center gap-1.5 px-6 py-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            className={`flex-1 rounded-full ${
              index + 1 === CURRENT_STEP
                ? 'h-1 bg-primary-500'
                : 'h-0.5 bg-background-tertiary'
            }`}
            style={
              index + 1 === CURRENT_STEP
                ? {
                    shadowColor: '#00f5d4',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 4,
                  }
                : undefined
            }
          />
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="pt-6 pb-8">
          <Text className="text-4xl font-medium text-white leading-tight tracking-tight">
            Select your
          </Text>
          <Text className="text-4xl font-medium text-primary-500 leading-tight tracking-tight">
            Activity Type
          </Text>
          <Text className="text-sm text-gray-400 mt-3 leading-relaxed">
            We tailor your dashboard based on your primary movement style.
          </Text>
        </View>

        {/* Activity Cards */}
        <View className="gap-4">
          {ACTIVITY_OPTIONS.map((option) => (
            <ActivityTypeCard
              key={option.type}
              type={option.type}
              title={option.title}
              badge={option.badge}
              badgeVariant={option.badgeVariant}
              targetText={option.targetText}
              targetIcon={option.targetIcon}
              image={option.image}
              selected={activityType === option.type}
              onPress={() => setActivityType(option.type)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        {/* Gradient overlay */}
        <View className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-primary via-background-primary/95 to-transparent pointer-events-none" />
        <View className="relative">
          <Button onPress={handleContinue} disabled={!activityType}>
            Next Step
          </Button>
        </View>
      </View>
    </View>
  );
}
