import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Icon } from '@/components/ui';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SelectDropdownProps<T extends string> {
  label: string;
  placeholder: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

export function SelectDropdown<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
}: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: T) => {
    Haptics.selectionAsync();
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View className="mb-6">
      {/* Label */}
      <Text className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.25em] mb-3">
        {label}
      </Text>

      {/* Dropdown Trigger */}
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          setIsOpen(true);
        }}
        className="h-16 px-5 rounded-xl bg-background-secondary/60 border border-white/5 flex-row items-center justify-between active:border-primary-500/50"
      >
        <Text
          className={`text-lg ${selectedOption ? 'text-white' : 'text-gray-500'}`}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Icon name="chevron-down" size="md" color="#00f5d4" />
      </Pressable>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/60"
          onPress={() => setIsOpen(false)}
        />
        <View
          className="bg-background-primary rounded-t-3xl border-t border-white/10"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          {/* Handle */}
          <View className="items-center pt-3 pb-4">
            <View className="w-10 h-1 rounded-full bg-gray-600" />
          </View>

          {/* Title */}
          <Text className="text-lg font-semibold text-white text-center mb-4">
            {label}
          </Text>

          {/* Options */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item.value)}
                className={`mx-4 mb-2 p-4 rounded-xl flex-row items-center justify-between ${
                  item.value === value
                    ? 'bg-primary-500/20 border border-primary-500/30'
                    : 'bg-background-secondary/60 border border-transparent'
                }`}
              >
                <Text
                  className={`text-base ${
                    item.value === value ? 'text-primary-500 font-semibold' : 'text-white'
                  }`}
                >
                  {item.label}
                </Text>
                {item.value === value && (
                  <Icon name="check" size="sm" color="#00f5d4" />
                )}
              </Pressable>
            )}
            scrollEnabled={options.length > 5}
            style={{ maxHeight: 400 }}
          />
        </View>
      </Modal>
    </View>
  );
}
