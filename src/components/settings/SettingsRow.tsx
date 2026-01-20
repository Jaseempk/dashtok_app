import { View, Text, Pressable } from 'react-native';
import { Icon, IconName } from '@/components/ui';
import { colors } from '@/styles/tokens';

interface SettingsRowProps {
  icon: IconName;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export function SettingsRow({
  icon,
  iconColor,
  label,
  value,
  onPress,
  showChevron = true,
  variant = 'default',
  disabled = false,
}: SettingsRowProps) {
  const isDanger = variant === 'danger';
  const textColor = isDanger ? 'text-red-500' : 'text-white';
  const defaultIconColor = isDanger ? colors.error : '#6b7280';

  const content = (
    <View className="flex-row items-center px-4 py-3.5">
      {/* Icon */}
      <View
        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: `${iconColor ?? defaultIconColor}20` }}
      >
        <Icon name={icon} size="md" color={iconColor ?? defaultIconColor} />
      </View>

      {/* Label */}
      <Text className={`flex-1 text-base ${textColor} ${disabled ? 'opacity-50' : ''}`}>
        {label}
      </Text>

      {/* Value */}
      {value && (
        <Text className="text-sm text-gray-400 mr-2">{value}</Text>
      )}

      {/* Chevron */}
      {showChevron && onPress && (
        <Icon name="arrow-forward" size="sm" color="#6b7280" />
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        className="active:bg-background-tertiary"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
