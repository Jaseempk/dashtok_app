import { View, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  // AuthGuard handles all redirect logic
  // This screen shows briefly while determining auth state
  return (
    <View className="flex-1 bg-background-primary items-center justify-center">
      <Text className="text-primary-500 text-3xl font-bold mb-4">Dashtok</Text>
      <ActivityIndicator size="large" color="#00f5d4" />
    </View>
  );
}
