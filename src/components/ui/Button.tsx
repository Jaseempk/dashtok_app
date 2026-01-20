import { Text, ActivityIndicator, PressableProps } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantStyles = {
  primary: {
    container: 'bg-primary-500',
    text: 'text-black font-semibold',
  },
  secondary: {
    container: 'bg-background-tertiary border border-border-default',
    text: 'text-white font-semibold',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-primary-500 font-semibold',
  },
} as const;

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
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
        <Text className={`text-base ${styles.text}`}>{children}</Text>
      )}
    </AnimatedPressable>
  );
}
