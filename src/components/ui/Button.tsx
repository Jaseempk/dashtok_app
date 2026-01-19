import { Pressable, Text, ActivityIndicator, PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantStyles = {
  primary: {
    container: 'bg-primary-500 active:bg-primary-600',
    text: 'text-black font-semibold',
  },
  secondary: {
    container: 'bg-background-tertiary border border-border-default active:bg-background-secondary',
    text: 'text-white font-semibold',
  },
  ghost: {
    container: 'bg-transparent active:bg-background-tertiary',
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
    <Pressable
      className={`h-14 rounded-xl items-center justify-center ${styles.container} ${
        isDisabled ? 'opacity-50' : ''
      }`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : '#00f5d4'} />
      ) : (
        <Text className={`text-base ${styles.text}`}>{children}</Text>
      )}
    </Pressable>
  );
}
