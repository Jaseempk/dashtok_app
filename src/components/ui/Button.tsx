import { View, Text, ActivityIndicator, PressableProps } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { Icon, IconName } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: IconName;
}

const variantStyles = {
  primary: {
    container: 'bg-primary-500',
    text: 'text-black font-semibold',
    iconColor: '#000000',
  },
  secondary: {
    container: 'bg-background-tertiary border border-border-default',
    text: 'text-white font-semibold',
    iconColor: '#ffffff',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-primary-500 font-semibold',
    iconColor: '#00f5d4',
  },
} as const;

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  icon,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || isLoading;

  return (
    <AnimatedPressable
      className={`h-14 rounded-xl items-center justify-center ${styles.container} ${
        isDisabled ? 'opacity-50' : ''
      }`}
      disabled={isDisabled}
      haptic={isDisabled ? false : 'medium'}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : '#00f5d4'} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon && <Icon name={icon} size="sm" color={styles.iconColor} />}
          <Text className={`text-base ${styles.text}`}>{children}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}
