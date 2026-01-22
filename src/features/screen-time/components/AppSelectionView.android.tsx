import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';
import type { AppSelectionViewProps } from './AppSelectionView';

/**
 * Android placeholder for App Selection.
 * TODO: Implement using Android's UsageStatsManager permission flow
 * and custom app list picker.
 */
export function AppSelectionViewAndroid({
  style,
}: AppSelectionViewProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        },
        style,
      ]}
    >
      <View className="w-20 h-20 rounded-full bg-gray-500/10 items-center justify-center mb-4">
        <Icon name="construct" size="3xl" color="#9ca3af" />
      </View>
      <Text className="text-lg font-semibold text-white text-center mb-2">
        Coming Soon
      </Text>
      <Text className="text-sm text-gray-400 text-center leading-relaxed">
        App blocking is currently only available on iOS.{'\n'}
        Android support is coming in a future update.
      </Text>
    </View>
  );
}
