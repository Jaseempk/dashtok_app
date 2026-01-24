import { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Icon } from '@/components/ui';
import { CircularProgress, AnalysisStep, type StepStatus } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { onboardingApi } from '@/features/onboarding/api/onboardingApi';
import { healthService } from '@/features/health/services/healthService';

interface AnalysisStepConfig {
  label: string;
  progressThreshold: number;
}

const ANALYSIS_STEPS: AnalysisStepConfig[] = [
  { label: 'Reading activity history', progressThreshold: 25 },
  { label: 'Analyzing behavior patterns', progressThreshold: 50 },
  { label: 'Generating personalized goal', progressThreshold: 75 },
  { label: 'Preparing your profile', progressThreshold: 100 },
];

const ANIMATION_DURATION = 8000; // 8 seconds for full progress

export default function AnalyzingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    ageRange,
    gender,
    heightRange,
    fitnessLevel,
    behaviorScores,
    activityType,
    healthConnected,
    getBehaviorScore,
    setHealthBaseline,
    setGoalRecommendation,
  } = useOnboardingStore();

  const progress = useSharedValue(0);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(['pending', 'pending', 'pending', 'pending']);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);
  const isComplete = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Start smooth progress animation
    progress.value = withTiming(100, {
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // Run actual analysis in parallel
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    try {
      // Step 1: Read health baseline (if connected)
      setStepStatuses(['loading', 'pending', 'pending', 'pending']);

      let baseline = null;
      if (healthConnected) {
        baseline = await healthService.getBaseline(90);
        setHealthBaseline(baseline);
      }

      setStepStatuses(['complete', 'loading', 'pending', 'pending']);

      // Step 2: Prepare data (brief pause)
      await delay(300);

      // Step 3: Call LLM API
      setStepStatuses(['complete', 'complete', 'loading', 'pending']);

      const behaviorScore = getBehaviorScore();
      const recommendation = await onboardingApi.generateGoal({
        ageRange: ageRange!,
        gender: gender!,
        heightRange: heightRange!,
        fitnessLevel: fitnessLevel!,
        behaviorScore,
        behaviorBreakdown: {
          unconsciousUsage: behaviorScores.unconsciousUsage ?? 0,
          timeDisplacement: behaviorScores.timeDisplacement ?? 0,
          productivityImpact: behaviorScores.productivityImpact ?? 0,
          failedRegulation: behaviorScores.failedRegulation ?? 0,
        },
        activityType: activityType!,
        healthBaseline: baseline,
      });

      setGoalRecommendation(recommendation);
      setStepStatuses(['complete', 'complete', 'complete', 'loading']);

      // Step 4: Finalize
      await delay(300);
      setStepStatuses(['complete', 'complete', 'complete', 'complete']);
      isComplete.current = true;

      // Snap progress to 100 and navigate
      progress.value = withTiming(100, { duration: 400 }, () => {
        // Navigate after animation completes
      });

      // Small delay then navigate
      await delay(600);
      router.replace('/(onboarding)/profile-result');
    } catch (err) {
      console.error('[Analyzing] Error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');

      // Update step status to show error
      setStepStatuses((prev) => {
        const loadingIdx = prev.findIndex((s) => s === 'loading');
        if (loadingIdx >= 0) {
          const updated = [...prev];
          updated[loadingIdx] = 'error';
          return updated;
        }
        return prev;
      });
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
            AI Analysis
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
            status={stepStatuses[index] ?? 'pending'}
            stepNumber={index + 1}
          />
        ))}
      </View>

      {/* Error message */}
      {error && (
        <View className="px-6 mt-6">
          <View className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4">
            <Text className="text-red-400 text-sm text-center">{error}</Text>
            <Text
              className="text-primary-500 text-sm text-center mt-2 font-medium"
              onPress={() => {
                setError(null);
                hasStarted.current = false;
                setStepStatuses(['pending', 'pending', 'pending', 'pending']);
                setProgress(0);
                runAnalysis();
              }}
            >
              Tap to retry
            </Text>
          </View>
        </View>
      )}

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
