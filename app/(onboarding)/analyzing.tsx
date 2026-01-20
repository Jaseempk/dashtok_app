import { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui';
import { CircularProgress, AnalysisStep } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

const ANALYSIS_STEPS = [
  { label: 'Calculating consistency profile', threshold: 25 },
  { label: 'Identifying motivation triggers', threshold: 50 },
  { label: 'Building personalized strategy', threshold: 75 },
  { label: 'Generating fitness-reward balance', threshold: 100 },
];

const TOTAL_DURATION = 6000; // 6 seconds

export default function AnalyzingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { computeProfile } = useOnboardingStore();

  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        // Compute profile based on answers
        computeProfile();
        // Navigate to report after a brief pause
        setTimeout(() => {
          router.replace('/(onboarding)/report');
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [computeProfile, router]);

  const getStepStatus = (threshold: number) => {
    if (progress >= threshold) return 'complete';
    if (progress >= threshold - 25) return 'loading';
    return 'pending';
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header Badge */}
      <View className="items-center pt-8 pb-4">
        <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30">
          <View className="w-2 h-2 rounded-full bg-primary-500" />
          <Text className="text-primary-500 text-xs font-semibold tracking-wider uppercase">
            System Diagnostic
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold text-white text-center mb-8">
        Analyzing your{'\n'}patterns...
      </Text>

      {/* Progress Ring */}
      <View className="items-center mb-10">
        <CircularProgress progress={progress} size={200} strokeWidth={10} />
      </View>

      {/* Steps */}
      <View className="px-6 gap-3">
        {ANALYSIS_STEPS.map((step, index) => (
          <AnalysisStep
            key={step.label}
            label={step.label}
            status={getStepStatus(step.threshold)}
            stepNumber={index + 1}
          />
        ))}
      </View>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 items-center pb-8">
        <View className="flex-row items-center gap-1.5">
          <Icon name="lock" size="xs" color="#6b7280" />
          <Text className="text-gray-500 text-xs tracking-wider uppercase">
            Secure Data Encryption Active
          </Text>
        </View>
      </View>
    </View>
  );
}
