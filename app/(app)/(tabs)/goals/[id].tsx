import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams();

  // TODO: Implement goal detail/edit
  return (
    <View>
      <Text>Goal Detail: {id}</Text>
    </View>
  );
}
