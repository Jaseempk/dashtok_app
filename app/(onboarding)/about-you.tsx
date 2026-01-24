import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { OnboardingHeader, ChipSelector } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import type { AgeRange, Gender, HeightRange } from '@/features/onboarding/types/onboarding.types';

const AGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55+', label: '55+' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

const HEIGHT_OPTIONS: { value: HeightRange; label: string }[] = [
  { value: 'under-150', label: 'Under 150cm' },
  { value: '150-165', label: '150-165cm' },
  { value: '165-180', label: '165-180cm' },
  { value: 'over-180', label: 'Over 180cm' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

export default function AboutYouScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ageRange, gender, heightRange, setAgeRange, setGender, setHeightRange } =
    useOnboardingStore();

  const canContinue = ageRange && gender && heightRange;

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      <OnboardingHeader step={1} total={7} />

      <ScrollView className="flex-1" contentContainerClassName="px-6 pb-32">
        <Text className="text-4xl font-medium text-white pt-2 pb-2">
          Tell us about{'\n'}yourself
        </Text>
        <Text className="text-sm text-gray-400 mb-8">
          Help us personalize your goal
        </Text>

        <ChipSelector label="Age" options={AGE_OPTIONS} value={ageRange} onChange={setAgeRange} />
        <ChipSelector label="Gender" options={GENDER_OPTIONS} value={gender} onChange={setGender} />
        <ChipSelector label="Height" options={HEIGHT_OPTIONS} value={heightRange} onChange={setHeightRange} />
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button
          onPress={() => router.push('/(onboarding)/health-permissions')}
          disabled={!canContinue}
        >
          Continue
        </Button>
      </View>
    </View>
  );
}
