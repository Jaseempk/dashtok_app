import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background-primary">
      <Text className="text-white text-xl mb-4">Screen not found</Text>
      <Link href="/" className="text-primary-500">
        Go home
      </Link>
    </View>
  );
}
