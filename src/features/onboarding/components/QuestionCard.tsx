import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { AnimatedPressable, Icon } from '@/components/ui';

interface QuestionCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  variant?: 'radio' | 'checkbox';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function QuestionCard({
  label,
  description,
  selected,
  onPress,
  variant = 'radio',
  icon,
  iconPosition = 'right',
}: QuestionCardProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      className={`flex-row items-center gap-4 rounded-2xl border p-4 ${
        selected
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-border-subtle bg-background-secondary'
      }`}
    >
      {icon && iconPosition === 'left' && (
        <View className="w-10 h-10 rounded-full bg-background-tertiary items-center justify-center">
          {icon}
        </View>
      )}

      <View className="flex-1">
        <Text
          className={`text-[15px] font-medium leading-snug ${
            selected ? 'text-white' : 'text-white'
          }`}
        >
          {label}
        </Text>
        {description && (
          <Text className="text-sm text-gray-400 mt-0.5">{description}</Text>
        )}
      </View>

      {icon && iconPosition === 'right' && (
        <View className="w-10 h-10 rounded-full bg-background-tertiary items-center justify-center">
          {icon}
        </View>
      )}

      {!icon && (
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            selected
              ? 'border-primary-500 bg-primary-500'
              : 'border-gray-500'
          }`}
        >
          {selected && variant === 'radio' && (
            <View className="w-2.5 h-2.5 rounded-full bg-background-primary" />
          )}
          {selected && variant === 'checkbox' && (
            <Icon name="check" size="sm" color="#0a0f1a" />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}
