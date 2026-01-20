import { View, Text, Image, Pressable } from 'react-native';
import { Icon } from '@/components/ui';
import { colors } from '@/styles/tokens';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  onEdit?: () => void;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    const first = parts[0][0] ?? '';
    const second = parts[1][0] ?? '';
    return `${first}${second}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Avatar({ uri, name, size = 100, onEdit }: AvatarProps) {
  const initials = getInitials(name);
  const fontSize = size * 0.35;

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }} className="relative">
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            className="bg-background-tertiary"
          />
        ) : (
          <View
            style={{ width: size, height: size, borderRadius: size / 2 }}
            className="bg-background-tertiary items-center justify-center"
          >
            <Text
              style={{ fontSize }}
              className="font-bold text-gray-400"
            >
              {initials}
            </Text>
          </View>
        )}

        {/* Edit Badge */}
        {onEdit && (
          <Pressable
            onPress={onEdit}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 items-center justify-center border-2 border-background-primary"
          >
            <Icon name="edit" size="sm" color="#000000" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
