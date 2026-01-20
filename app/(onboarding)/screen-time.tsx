import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout, OnboardingHero, QuestionCard } from '@/features/onboarding/components';
import { useOnboardingStore, ScreenTimeFeeling } from '@/features/onboarding/store/onboardingStore';

const OPTIONS: { value: ScreenTimeFeeling; label: string }[] = [
  { value: 'guilty', label: 'Guilty - I scroll mindlessly and regret it' },
  { value: 'wish-moved', label: "It's fine but I wish I moved more instead" },
  { value: 'no-system', label: 'I want to set boundaries but have no system' },
  { value: 'for-child', label: "I'm setting this up for my child" },
];

export default function ScreenTimeScreen() {
  const router = useRouter();
  const { screenTimeFeeling, setScreenTimeFeeling } = useOnboardingStore();

  const handleContinue = () => {
    router.push('/(onboarding)/past-apps');
  };

  return (
    <OnboardingLayout
      showProgress
      currentStep={2}
      totalSteps={6}
      primaryButtonText="Continue"
      primaryButtonDisabled={!screenTimeFeeling}
      onPrimaryPress={handleContinue}
    >
      {/* Illustration */}
      <OnboardingHero
        fallbackContent={
          <View className="items-center">
            <Text className="text-5xl mb-2">⏳</Text>
            <Text className="text-gray-400 text-sm mt-2">Time slipping away...</Text>
          </View>
        }
      />

      {/* Question */}
      <View className="mb-6">
        <Text className="text-[26px] font-bold text-white text-center leading-tight mb-3">
          How do you feel about your current screen time?
        </Text>
        <Text className="text-base text-gray-400 text-center">
          Most people spend <Text className="text-primary-500 font-semibold">4+ hours</Text> daily on their phones.
        </Text>
      </View>

      {/* Options */}
      <View className="gap-3">
        {OPTIONS.map((option) => (
          <QuestionCard
            key={option.value}
            label={option.label}
            selected={screenTimeFeeling === option.value}
            onPress={() => setScreenTimeFeeling(option.value)}
            variant="radio"
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
