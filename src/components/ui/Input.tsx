import { TextInput, View, Text, TextInputProps } from 'react-native';
import { forwardRef } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <View className="gap-1.5">
        {label && (
          <Text className="text-sm text-gray-400 ml-1">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`h-14 px-4 rounded-xl bg-background-secondary text-white text-base ${
            error ? 'border border-red-500' : 'border border-transparent'
          }`}
          placeholderTextColor="#6b7280"
          {...props}
        />
        {error && (
          <Text className="text-sm text-red-500 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
