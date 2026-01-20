import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui';
import { OnboardingLayout, OnboardingHero, QuestionCard } from '@/features/onboarding/components';
import { useOnboardingStore, PastAppIssue } from '@/features/onboarding/store/onboardingStore';

const OPTIONS: { value: PastAppIssue; label: string }[] = [
  { value: 'bored', label: 'Got bored after the novelty wore off' },
  { value: 'no-reward', label: 'No real reward for showing up' },
  { value: 'complicated', label: 'Too complicated or time-consuming' },
  { value: 'forgot', label: 'Forgot to open them' },
  { value: 'first-app', label: 'This is my first fitness app' },
];

export default function PastAppsScreen() {
  const router = useRouter();
  const { pastAppIssues, togglePastAppIssue } = useOnboardingStore();

  const handleContinue = () => {
    router.push('/(onboarding)/analyzing');
  };

  const hasSelection = pastAppIssues.length > 0;

  return (
    <OnboardingLayout
      showProgress
      currentStep={3}
      totalSteps={6}
      primaryButtonText="Continue"
      primaryButtonDisabled={!hasSelection}
      onPrimaryPress={handleContinue}
    >
      {/* Illustration */}
      <OnboardingHero
        fallbackContent={
          <View className="items-center">
            <Text className="text-5xl mb-2">🪦</Text>
            <View className="flex-row gap-3 mt-2">
              <Icon name="activity" size="xl" color="#6b7280" style={{ opacity: 0.5 }} />
              <Icon name="run" size="xl" color="#6b7280" style={{ opacity: 0.5 }} />
              <Icon name="walk" size="xl" color="#6b7280" style={{ opacity: 0.5 }} />
            </View>
            <View className="mt-3">
              <Icon name="error" size="xl" color="#00f5d4" />
            </View>
          </View>
        }
      />

      {/* Question */}
      <View className="mb-6">
        <Text className="text-[26px] font-bold text-white text-center leading-tight mb-3">
          What happened with other fitness apps you've tried?
        </Text>
        <Text className="text-base text-gray-400 text-center">
          Understanding this helps us do better.
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-1">
          Select all that apply
        </Text>
      </View>

      {/* Options */}
      <View className="gap-3">
        {OPTIONS.map((option) => (
          <QuestionCard
            key={option.value}
            label={option.label}
            selected={pastAppIssues.includes(option.value)}
            onPress={() => togglePastAppIssue(option.value)}
            variant="checkbox"
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
