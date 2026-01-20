import { View, Text } from 'react-native';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
        {title}
      </Text>
      <View className="bg-background-secondary rounded-xl overflow-hidden">
        {children}
      </View>
    </View>
  );
}
