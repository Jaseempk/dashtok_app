import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui';
import { OnboardingLayout, OnboardingHero, QuestionCard } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import type { FitnessLevel } from '@/features/onboarding/types/onboarding.types';
import * as Haptics from 'expo-haptics';

const FITNESS_OPTIONS: { value: FitnessLevel; label: string; description: string }[] = [
  {
    value: 'sedentary',
    label: 'I mostly sit',
    description: 'Desk job, minimal movement',
  },
  {
    value: 'light',
    label: 'I walk occasionally',
    description: "Don't exercise regularly",
  },
  {
    value: 'moderate',
    label: 'I exercise 2-3 times per week',
    description: 'Regular activity',
  },
  {
    value: 'active',
    label: 'I exercise 4+ times per week',
    description: 'Very active lifestyle',
  },
];

export default function FitnessHabitsScreen() {
  const router = useRouter();
  const { fitnessLevel, setFitnessLevel } = useOnboardingStore();

  const handleSelect = (value: FitnessLevel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFitnessLevel(value);
  };

  return (
    <OnboardingLayout
      skipTopInset
      primaryButtonText="Continue"
      primaryButtonDisabled={!fitnessLevel}
      onPrimaryPress={() => router.push('/(onboarding)/behavior-1')}
    >
      <OnboardingHero
        fallbackContent={
          <Icon name="fitness" size="3xl" color="#00f5d4" />
        }
      />

      <View className="mb-6">
        <Text className="text-[26px] font-bold text-white leading-tight">
          How would you describe your current activity level?
        </Text>
        <Text className="text-sm text-gray-400 mt-2">
          Be honest — this helps us set the right starting point.
        </Text>
      </View>

      <View className="gap-3">
        {FITNESS_OPTIONS.map((opt) => (
          <QuestionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            selected={fitnessLevel === opt.value}
            onPress={() => handleSelect(opt.value)}
            variant="radio"
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
