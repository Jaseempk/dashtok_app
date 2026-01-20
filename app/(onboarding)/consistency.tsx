import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout, OnboardingHero, QuestionCard } from '@/features/onboarding/components';
import { useOnboardingStore, ConsistencyLevel } from '@/features/onboarding/store/onboardingStore';

const OPTIONS: { value: ConsistencyLevel; label: string }[] = [
  { value: 'start-strong', label: 'I start strong but lose motivation after a few days' },
  { value: 'inconsistent', label: "I'm inconsistent - some weeks great, others nothing" },
  { value: 'accountability', label: 'I exercise regularly but want more accountability' },
  { value: 'rarely', label: 'I rarely exercise and want to change that' },
];

export default function ConsistencyScreen() {
  const router = useRouter();
  const { consistencyLevel, setConsistencyLevel } = useOnboardingStore();

  const handleContinue = () => {
    router.push('/(onboarding)/screen-time');
  };

  return (
    <OnboardingLayout
      showProgress
      currentStep={1}
      totalSteps={6}
      primaryButtonText="Continue"
      primaryButtonDisabled={!consistencyLevel}
      onPrimaryPress={handleContinue}
    >
      {/* Illustration */}
      <OnboardingHero
        fallbackContent={
          <View className="items-center">
            <Text className="text-4xl mb-2">📅</Text>
            <View className="flex-row gap-1 mt-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <View
                  key={day + i}
                  className={`w-6 h-6 rounded items-center justify-center ${
                    [0, 3, 6].includes(i)
                      ? 'bg-primary-500/20 border border-primary-500'
                      : 'bg-background-tertiary border border-border-subtle'
                  }`}
                >
                  {[0, 3, 6].includes(i) && (
                    <Text className="text-primary-500 text-xs">✓</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        }
      />

      {/* Question */}
      <View className="mb-6">
        <Text className="text-[26px] font-bold text-white text-center leading-tight mb-3">
          How often do you actually stick to your fitness plans?
        </Text>
        <Text className="text-base text-gray-400 text-center">
          Be honest - no judgment here.
        </Text>
      </View>

      {/* Options */}
      <View className="gap-3">
        {OPTIONS.map((option) => (
          <QuestionCard
            key={option.value}
            label={option.label}
            selected={consistencyLevel === option.value}
            onPress={() => setConsistencyLevel(option.value)}
            variant="radio"
          />
        ))}
      </View>
    </OnboardingLayout>
  );
}
