import { View, Pressable, ViewProps, PressableProps } from 'react-native';

interface CardProps extends ViewProps {
  onPress?: PressableProps['onPress'];
}

export function Card({ children, className = '', onPress, ...props }: CardProps) {
  const baseStyles = 'bg-background-secondary rounded-2xl border border-border-subtle';

  if (onPress) {
    return (
      <Pressable
        className={`${baseStyles} active:opacity-80 ${className}`}
        onPress={onPress}
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={`${baseStyles} ${className}`} {...props}>
      {children}
    </View>
  );
}
