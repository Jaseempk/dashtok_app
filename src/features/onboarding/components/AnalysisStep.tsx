import { View, Text, ActivityIndicator } from 'react-native';

type StepStatus = 'pending' | 'loading' | 'complete';

interface AnalysisStepProps {
  label: string;
  status: StepStatus;
  stepNumber?: number;
}

export function AnalysisStep({ label, status, stepNumber }: AnalysisStepProps) {
  return (
    <View className="flex-row items-center gap-4 p-4 rounded-xl bg-background-secondary border border-border-subtle">
      {/* Status indicator */}
      <View className="w-8 h-8 rounded-full items-center justify-center">
        {status === 'pending' && (
          <View className="w-5 h-5 rounded-full border-2 border-gray-600" />
        )}
        {status === 'loading' && (
          <ActivityIndicator size="small" color="#00f5d4" />
        )}
        {status === 'complete' && (
          <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
            <Text className="text-background-primary text-xs font-bold">✓</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        {stepNumber && (
          <Text className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
            {status === 'loading' ? 'Computing' : `Step ${stepNumber.toString().padStart(2, '0')}`}
          </Text>
        )}
        <Text
          className={`text-[15px] font-medium ${
            status === 'complete' ? 'text-white' : 'text-gray-400'
          }`}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
