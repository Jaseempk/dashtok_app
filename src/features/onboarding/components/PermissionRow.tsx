import { View, Text } from 'react-native';
import { Icon, IconName } from '@/components/ui';

interface PermissionRowProps {
  icon: IconName;
  title: string;
  description: string;
}

export function PermissionRow({ icon, title, description }: PermissionRowProps) {
  return (
    <View className="flex-row items-center gap-4 p-4 rounded-xl bg-background-secondary border border-border-subtle">
      {/* Icon */}
      <View className="w-12 h-12 rounded-full bg-primary-500/10 border border-primary-500/30 items-center justify-center">
        <Icon name={icon} size="lg" color="#00f5d4" />
      </View>

      {/* Text */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-white mb-0.5">{title}</Text>
        <Text className="text-sm text-gray-400">{description}</Text>
      </View>

      {/* Checkmark */}
      <View className="w-6 h-6 rounded-full bg-primary-500/20 items-center justify-center">
        <Icon name="check" size="sm" color="#00f5d4" />
      </View>
    </View>
  );
}
