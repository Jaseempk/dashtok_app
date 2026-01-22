import { View, Text, Pressable, Alert } from 'react-native';
import { Icon } from '@/components/ui';
import { useEmergencyBypass } from '../hooks/useEmergencyBypass';

interface EmergencyBypassButtonProps {
  bypassesLeft: number;
  isAvailable: boolean;
  onSuccess?: () => void;
}

/**
 * Emergency bypass button with rate limit indicator.
 * Grants 5 minutes of access, limited to 3 uses per day.
 */
export function EmergencyBypassButton({
  bypassesLeft,
  isAvailable,
  onSuccess,
}: EmergencyBypassButtonProps) {
  const { mutate: requestBypass, isPending } = useEmergencyBypass();

  const handlePress = () => {
    if (!isAvailable || bypassesLeft <= 0) {
      Alert.alert(
        'Bypass Unavailable',
        'You have used all your emergency bypasses for today. Complete your fitness goal to unlock your apps.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Emergency Bypass',
      `This will grant you 5 minutes of access. You have ${bypassesLeft} bypass${bypassesLeft !== 1 ? 'es' : ''} left today.\n\nUse wisely - this is for genuine emergencies only.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Bypass',
          style: 'destructive',
          onPress: () => {
            requestBypass(undefined, {
              onSuccess: (result) => {
                if (result.granted) {
                  Alert.alert(
                    'Bypass Activated',
                    `You have 5 minutes of access. ${result.bypassesRemaining ?? 0} bypass${(result.bypassesRemaining ?? 0) !== 1 ? 'es' : ''} remaining today.`,
                    [{ text: 'OK' }]
                  );
                  onSuccess?.();
                } else {
                  Alert.alert(
                    'Bypass Failed',
                    result.reason === 'daily_limit_reached'
                      ? 'You have reached your daily bypass limit.'
                      : 'Unable to activate bypass. Please try again.',
                    [{ text: 'OK' }]
                  );
                }
              },
              onError: () => {
                Alert.alert(
                  'Error',
                  'Unable to activate bypass. Please check your connection and try again.',
                  [{ text: 'OK' }]
                );
              },
            });
          },
        },
      ]
    );
  };

  const disabled = !isAvailable || bypassesLeft <= 0 || isPending;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`py-3 px-4 rounded-xl border ${
        disabled
          ? 'border-gray-700 bg-transparent'
          : 'border-red-500/30 bg-red-500/10 active:bg-red-500/20'
      }`}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Icon
          name="warning"
          size="sm"
          color={disabled ? '#6b7280' : '#ef4444'}
        />
        <Text
          className={`text-sm font-medium ${
            disabled ? 'text-gray-500' : 'text-red-400'
          }`}
        >
          {isPending
            ? 'Activating...'
            : bypassesLeft <= 0
              ? 'No bypasses left today'
              : `Emergency 5-min bypass (${bypassesLeft} left)`}
        </Text>
      </View>
    </Pressable>
  );
}
