import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();

  // TODO: Implement activity detail
  return (
    <View>
      <Text>Activity Detail: {id}</Text>
    </View>
  );
}
