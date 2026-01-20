import { useState, forwardRef } from 'react';
import { TextInput, View, Text, Pressable, TextInputProps } from 'react-native';
import { Icon, IconName } from '@/components/ui';
import { colors } from '@/styles/tokens';

interface AuthInputProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  error?: string;
  rightElement?: React.ReactNode;
}

export const AuthInput = forwardRef<TextInput, AuthInputProps>(
  ({ label, icon, error, rightElement, secureTextEntry, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = secureTextEntry !== undefined;

    return (
      <View className="gap-2">
        {label && (
          <Text className="text-xs text-primary-500 font-medium tracking-widest uppercase">
            {label}
          </Text>
        )}
        <View
          className={`flex-row items-center h-14 px-4 rounded-xl bg-background-tertiary border ${
            error ? 'border-red-500' : 'border-transparent'
          }`}
        >
          {icon && (
            <View className="mr-3">
              <Icon name={icon} size="md" color={colors.text.muted} />
            </View>
          )}
          <TextInput
            ref={ref}
            className="flex-1 text-white text-base"
            placeholderTextColor={colors.text.muted}
            secureTextEntry={isPassword && !isPasswordVisible}
            {...props}
          />
          {isPassword && (
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              hitSlop={8}
              className="ml-2"
            >
              <Icon
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size="md"
                color={colors.text.muted}
              />
            </Pressable>
          )}
          {rightElement}
        </View>
        {error && (
          <Text className="text-sm text-red-500 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

AuthInput.displayName = 'AuthInput';
