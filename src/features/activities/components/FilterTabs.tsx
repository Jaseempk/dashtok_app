import { View, Text, Pressable } from 'react-native';
import type { FilterPeriod } from '../types/activity.types';

interface FilterTabsProps {
  selected: FilterPeriod;
  onSelect: (period: FilterPeriod) => void;
}

const TABS: { value: FilterPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All' },
];

export function FilterTabs({ selected, onSelect }: FilterTabsProps) {
  return (
    <View className="flex-row bg-background-tertiary rounded-xl p-1">
      {TABS.map((tab) => {
        const isSelected = selected === tab.value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onSelect(tab.value)}
            className={`flex-1 py-2 px-3 rounded-lg items-center ${
              isSelected ? 'bg-primary-500' : ''
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isSelected ? 'text-black' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
