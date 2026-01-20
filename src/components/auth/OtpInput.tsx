import { useRef, useEffect } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { colors } from '@/styles/tokens';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
}

export function OtpInput({ value, onChange, length = 6, autoFocus = true }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!autoFocus) return;

    // Delay focus to ensure the component is mounted
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [autoFocus]);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(cleaned);
  };

  const digits = value.split('');

  return (
    <View>
      {/* Hidden input for keyboard */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
      />

      {/* Visual digit boxes */}
      <Pressable onPress={handlePress}>
        <View className="flex-row justify-center gap-3">
          {Array.from({ length }).map((_, index) => {
            const isActive = index === value.length;
            const isFilled = index < value.length;

            return (
              <View
                key={index}
                className={`w-12 h-14 rounded-xl items-center justify-center ${
                  isFilled
                    ? 'bg-white'
                    : isActive
                    ? 'bg-background-tertiary border-2 border-primary-500'
                    : 'bg-background-tertiary'
                }`}
              >
                {isFilled ? (
                  <View className="w-2.5 h-2.5 rounded-full bg-background-primary" />
                ) : null}
              </View>
            );
          })}
        </View>
      </Pressable>
    </View>
  );
}
