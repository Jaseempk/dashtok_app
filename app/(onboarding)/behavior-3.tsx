import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui';
import { OnboardingLayout, OnboardingHero, FrequencySelector } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { BEHAVIOR_QUESTIONS } from '@/features/onboarding/constants/behaviorQuestions';

const CONFIG = BEHAVIOR_QUESTIONS[2];

export default function Behavior3Screen() {
  const router = useRouter();
  const { behaviorScores, setBehaviorScore } = useOnboardingStore();

  return (
    <OnboardingLayout skipTopInset hideFooter>
      <OnboardingHero
        fallbackContent={<Icon name={CONFIG.icon as any} size="3xl" color="#00f5d4" />}
      />
      <View className="mb-6">
        <Text className="text-base text-gray-400 mb-2">
          Over the past two weeks, how often have you...
        </Text>
        <Text className="text-[26px] font-bold text-white leading-tight">
          {CONFIG.question}
        </Text>
      </View>
      <FrequencySelector
        value={behaviorScores[CONFIG.key]}
        onChange={(v) => setBehaviorScore(CONFIG.key, v)}
        onComplete={() => router.push(CONFIG.nextRoute as any)}
      />
    </OnboardingLayout>
  );
}
