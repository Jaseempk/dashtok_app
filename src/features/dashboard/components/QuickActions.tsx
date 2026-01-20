import { View } from 'react-native';
import { Button } from '@/components/ui';

interface QuickActionsProps {
  onLogManual?: () => void;
  onStartGps?: () => void;
}

export function QuickActions({ onLogManual, onStartGps }: QuickActionsProps) {
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">
        <Button variant="secondary" onPress={onLogManual} icon="edit">
          Log Manual
        </Button>
      </View>
      <View className="flex-1">
        <Button onPress={onStartGps} icon="location">
          Start GPS
        </Button>
      </View>
    </View>
  );
}
