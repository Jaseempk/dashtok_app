import { View, Text, Modal, Pressable } from 'react-native';
import { Button } from '@/components/ui';
import { colors } from '@/styles/tokens';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <View className="bg-background-secondary rounded-2xl p-6 w-full max-w-sm">
          {/* Title */}
          <Text className="text-xl font-bold text-white text-center mb-2">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-base text-gray-400 text-center mb-6">
            {message}
          </Text>

          {/* Actions */}
          <View className="gap-3">
            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              className={`py-3 rounded-xl items-center ${
                destructive ? 'bg-red-500' : 'bg-primary-500'
              } ${isLoading ? 'opacity-50' : 'active:opacity-80'}`}
            >
              <Text className={`font-semibold ${destructive ? 'text-white' : 'text-black'}`}>
                {isLoading ? 'Please wait...' : confirmLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              className="py-3 rounded-xl items-center bg-background-tertiary active:opacity-80"
            >
              <Text className="font-semibold text-gray-300">{cancelLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
