import { Switch, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/tokens';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onValueChange, disabled = false }: ToggleProps) {
  const handleChange = (newValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(newValue);
  };

  return (
    <Switch
      value={value}
      onValueChange={handleChange}
      disabled={disabled}
      trackColor={{
        false: colors.background.tertiary,
        true: colors.primary[500],
      }}
      thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
      ios_backgroundColor={colors.background.tertiary}
    />
  );
}
