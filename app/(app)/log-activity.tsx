import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { format, subHours } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { Icon, Button } from '@/components/ui';
import {
  useLogActivity,
  logActivityFormSchema,
  type LogActivityFormData,
  type ActivityType,
} from '@/features/activities';

export default function LogActivityModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const logActivity = useLogActivity();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LogActivityFormData>({
    resolver: zodResolver(logActivityFormSchema),
    defaultValues: {
      activityType: 'walk',
      distanceKm: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      startedAt: subHours(new Date(), 1), // Default to 1 hour ago
      steps: undefined,
      calories: undefined,
    },
  });

  const activityType = watch('activityType');
  const startedAt = watch('startedAt');

  const handleClose = () => {
    router.back();
  };

  const onSubmit = async (data: LogActivityFormData) => {
    const durationSeconds = data.hours * 3600 + data.minutes * 60 + data.seconds;
    const distanceMeters = data.distanceKm * 1000;
    const endedAt = new Date(data.startedAt.getTime() + durationSeconds * 1000);

    try {
      await logActivity.mutateAsync({
        activityType: data.activityType,
        distanceMeters,
        durationSeconds,
        startedAt: data.startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        source: 'manual',
        steps: data.steps,
        calories: data.calories,
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to log activity. Please try again.');
    }
  };

  const setActivityType = (type: ActivityType) => {
    setValue('activityType', type);
  };

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-subtle">
        <Pressable onPress={handleClose} className="w-10 h-10 items-center justify-center">
          <Icon name="close" size="lg" color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-white">Log Activity</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Activity Type Toggle */}
        <View className="flex-row bg-background-secondary rounded-xl p-1 mb-6">
          <Pressable
            onPress={() => setActivityType('walk')}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg ${
              activityType === 'walk' ? 'bg-blue-600' : ''
            }`}
          >
            <Icon name="walk" size="md" color={activityType === 'walk' ? '#ffffff' : '#6b7280'} />
            <Text className={activityType === 'walk' ? 'text-white font-medium' : 'text-gray-400'}>
              Walk
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActivityType('run')}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg ${
              activityType === 'run' ? 'bg-blue-600' : ''
            }`}
          >
            <Icon name="run" size="md" color={activityType === 'run' ? '#ffffff' : '#6b7280'} />
            <Text className={activityType === 'run' ? 'text-white font-medium' : 'text-gray-400'}>
              Run
            </Text>
          </Pressable>
        </View>

        {/* Distance Input */}
        <View className="mb-6">
          <Text className="text-sm text-gray-400 mb-2">Distance</Text>
          <View className="flex-row items-center bg-background-secondary rounded-xl border border-border-subtle">
            <Controller
              control={control}
              name="distanceKm"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="flex-1 px-4 py-4 text-2xl text-white"
                  placeholder="0.0"
                  placeholderTextColor="#4b5563"
                  keyboardType="decimal-pad"
                  value={value ? value.toString() : ''}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                />
              )}
            />
            <View className="px-4 py-2 bg-background-tertiary rounded-lg mr-2">
              <Text className="text-gray-400">km</Text>
            </View>
          </View>
          {errors.distanceKm && (
            <Text className="text-red-500 text-sm mt-1">{errors.distanceKm.message}</Text>
          )}
        </View>

        {/* Duration Input */}
        <View className="mb-6">
          <Text className="text-sm text-gray-400 mb-2">Duration</Text>
          <View className="flex-row items-center gap-2">
            <Controller
              control={control}
              name="hours"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1 bg-background-secondary rounded-xl border border-border-subtle px-4 py-4">
                  <TextInput
                    className="text-2xl text-white text-center"
                    placeholder="00"
                    placeholderTextColor="#4b5563"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={value ? value.toString().padStart(2, '0') : ''}
                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                  />
                </View>
              )}
            />
            <Text className="text-2xl text-gray-500">:</Text>
            <Controller
              control={control}
              name="minutes"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1 bg-background-secondary rounded-xl border border-border-subtle px-4 py-4">
                  <TextInput
                    className="text-2xl text-white text-center"
                    placeholder="00"
                    placeholderTextColor="#4b5563"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={value ? value.toString().padStart(2, '0') : ''}
                    onChangeText={(text) => onChange(Math.min(parseInt(text) || 0, 59))}
                  />
                </View>
              )}
            />
            <Text className="text-2xl text-gray-500">:</Text>
            <Controller
              control={control}
              name="seconds"
              render={({ field: { onChange, value } }) => (
                <View className="flex-1 bg-background-secondary rounded-xl border border-border-subtle px-4 py-4">
                  <TextInput
                    className="text-2xl text-white text-center"
                    placeholder="00"
                    placeholderTextColor="#4b5563"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={value ? value.toString().padStart(2, '0') : ''}
                    onChangeText={(text) => onChange(Math.min(parseInt(text) || 0, 59))}
                  />
                </View>
              )}
            />
            <View className="px-2">
              <Text className="text-xs text-gray-500">h:m:s</Text>
            </View>
          </View>
          {errors.minutes && (
            <Text className="text-red-500 text-sm mt-1">{errors.minutes.message}</Text>
          )}
        </View>

        {/* Start Time */}
        <View className="mb-6">
          <Text className="text-sm text-gray-400 mb-2">Start Time</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center justify-between bg-background-secondary rounded-xl border border-border-subtle px-4 py-4"
          >
            <View className="flex-row items-center gap-3">
              <Icon name="calendar" size="md" color="#3b82f6" />
              <Text className="text-base text-white">
                {format(startedAt, "EEEE, h:mm a")}
              </Text>
            </View>
            <Icon name="arrow-forward" size="sm" color="#6b7280" />
          </Pressable>
          {errors.startedAt && (
            <Text className="text-red-500 text-sm mt-1">{errors.startedAt.message}</Text>
          )}
        </View>

        {showDatePicker && (
          <Controller
            control={control}
            name="startedAt"
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                value={value}
                mode="datetime"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event: DateTimePickerEvent, date?: Date) => {
                  setShowDatePicker(false);
                  if (date) onChange(date);
                }}
              />
            )}
          />
        )}

        {/* Optional Details Divider */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-border-subtle" />
          <Text className="px-4 text-xs text-gray-500 tracking-wide">OPTIONAL DETAILS</Text>
          <View className="flex-1 h-px bg-border-subtle" />
        </View>

        {/* Steps and Calories */}
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-2">STEPS</Text>
            <View className="flex-row items-center bg-background-secondary rounded-xl border border-border-subtle px-3 py-3">
              <Icon name="footsteps" size="sm" color="#6b7280" />
              <Controller
                control={control}
                name="steps"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 ml-2 text-base text-white"
                    placeholder="0"
                    placeholderTextColor="#4b5563"
                    keyboardType="number-pad"
                    value={value?.toString() ?? ''}
                    onChangeText={(text) => onChange(parseInt(text) || undefined)}
                  />
                )}
              />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-2">CALORIES</Text>
            <View className="flex-row items-center bg-background-secondary rounded-xl border border-border-subtle px-3 py-3">
              <Icon name="flame" size="sm" color="#6b7280" />
              <Controller
                control={control}
                name="calories"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 ml-2 text-base text-white"
                    placeholder="0"
                    placeholderTextColor="#4b5563"
                    keyboardType="number-pad"
                    value={value?.toString() ?? ''}
                    onChangeText={(text) => onChange(parseInt(text) || undefined)}
                  />
                )}
              />
              <Text className="text-xs text-gray-500 ml-1">kcal</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="px-4 pt-4 bg-background-primary border-t border-border-subtle"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          onPress={handleSubmit(onSubmit)}
          isLoading={logActivity.isPending}
          icon="check"
        >
          Save Activity
        </Button>
      </View>
    </View>
  );
}
