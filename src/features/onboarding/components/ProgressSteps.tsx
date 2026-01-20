import { View } from 'react-native';

interface ProgressStepsProps {
  current: number;
  total: number;
}

export function ProgressSteps({ current, total }: ProgressStepsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < current
              ? 'bg-primary-500 shadow-sm'
              : 'bg-background-tertiary'
          }`}
          style={i < current ? { shadowColor: '#00f5d4', shadowRadius: 4, shadowOpacity: 0.5 } : undefined}
        />
      ))}
    </View>
  );
}
