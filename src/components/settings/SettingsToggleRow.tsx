import { View, Text } from 'react-native';
import { Icon, IconName, Toggle } from '@/components/ui';

interface SettingsToggleRowProps {
  icon: IconName;
  iconColor?: string;
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggleRow({
  icon,
  iconColor = '#6b7280',
  label,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}: SettingsToggleRowProps) {
  return (
    <View className="flex-row items-center px-4 py-3.5">
      {/* Icon */}
      <View
        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: `${iconColor}20` }}
      >
        <Icon name={icon} size="md" color={iconColor} />
      </View>

      {/* Label & Subtitle */}
      <View className="flex-1">
        <Text className={`text-base text-white ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </Text>
        {subtitle && (
          <Text className="text-xs text-gray-400 mt-0.5">{subtitle}</Text>
        )}
      </View>

      {/* Toggle */}
      <Toggle
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </View>
  );
}
