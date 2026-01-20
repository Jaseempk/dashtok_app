import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icon, Button, Slider } from '@/components/ui';
import {
  useCreateGoal,
  createGoalFormSchema,
  type CreateGoalFormData,
  type GoalActivityType,
  type GoalType,
} from '@/features/goals';

const ACTIVITY_OPTIONS: { type: GoalActivityType; label: string; icon: 'walk' | 'run' | 'footsteps' }[] = [
  { type: 'walk', label: 'Walk', icon: 'walk' },
  { type: 'run', label: 'Run', icon: 'run' },
  { type: 'any', label: 'Any', icon: 'footsteps' },
];

function GoalPreviewCard({
  activityType,
  targetValue,
  goalType,
  rewardMinutes,
}: {
  activityType: GoalActivityType;
  targetValue: number;
  goalType: GoalType;
  rewardMinutes: number;
}) {
  const activityLabel = activityType === 'any' ? 'Move' : activityType === 'walk' ? 'Walk' : 'Run';

  return (
    <View className="bg-background-secondary rounded-2xl p-4 border border-border-subtle">
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <View className="bg-primary-500/20 px-2 py-1 rounded self-start mb-2">
            <Text className="text-xs font-medium text-primary-500 uppercase">Preview</Text>
          </View>
          <Text className="text-2xl font-bold text-white">
            {activityLabel} {targetValue}km
          </Text>
          <Text className="text-sm text-primary-500 capitalize">{goalType}</Text>
        </View>
        <View className="w-16 h-16 rounded-xl bg-background-tertiary items-center justify-center">
          <Icon name="run" size="xl" color="#00f5d4" />
        </View>
      </View>

      <View className="flex-row items-center gap-2 pt-3 border-t border-border-subtle">
        <Icon name="trophy" size="sm" color="#6b7280" />
        <Text className="text-xs text-gray-400 uppercase">Reward</Text>
        <Text className="text-sm font-medium text-white ml-1">
          Get {rewardMinutes}m Screen Time
        </Text>
      </View>
    </View>
  );
}

export default function CreateGoalModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const createGoal = useCreateGoal();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalFormSchema),
    defaultValues: {
      goalType: 'daily',
      activityType: 'run',
      targetValue: 5,
      targetUnit: 'km',
      rewardMinutes: 30,
    },
  });

  const goalType = watch('goalType');
  const activityType = watch('activityType');
  const targetValue = watch('targetValue');
  const rewardMinutes = watch('rewardMinutes');

  const handleClose = () => {
    router.back();
  };

  const onSubmit = async (data: CreateGoalFormData) => {
    try {
      await createGoal.mutateAsync(data);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-subtle">
        <Pressable onPress={handleClose} className="w-10 h-10 items-center justify-center">
          <Icon name="close" size="lg" color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-white">New Goal</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Preview Card */}
        <View className="mb-6">
          <GoalPreviewCard
            activityType={activityType}
            targetValue={targetValue}
            goalType={goalType}
            rewardMinutes={rewardMinutes}
          />
        </View>

        {/* How often? */}
        <View className="mb-6">
          <Text className="text-base font-medium text-white mb-3">How often?</Text>
          <View className="flex-row bg-background-secondary rounded-xl p-1">
            <Pressable
              onPress={() => setValue('goalType', 'daily')}
              className={`flex-1 py-3 rounded-lg items-center ${
                goalType === 'daily' ? 'bg-primary-500' : ''
              }`}
            >
              <Text
                className={`font-medium ${
                  goalType === 'daily' ? 'text-black' : 'text-gray-400'
                }`}
              >
                Daily
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setValue('goalType', 'weekly')}
              className={`flex-1 py-3 rounded-lg items-center ${
                goalType === 'weekly' ? 'bg-primary-500' : ''
              }`}
            >
              <Text
                className={`font-medium ${
                  goalType === 'weekly' ? 'text-black' : 'text-gray-400'
                }`}
              >
                Weekly
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Activity Type */}
        <View className="mb-6">
          <Text className="text-base font-medium text-white mb-3">Activity</Text>
          <View className="flex-row gap-3">
            {ACTIVITY_OPTIONS.map((option) => (
              <Pressable
                key={option.type}
                onPress={() => setValue('activityType', option.type)}
                className={`flex-1 py-4 rounded-xl items-center border ${
                  activityType === option.type
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-border-subtle bg-background-secondary'
                }`}
              >
                <Icon
                  name={option.icon}
                  size="lg"
                  color={activityType === option.type ? '#00f5d4' : '#6b7280'}
                />
                <Text
                  className={`mt-2 text-sm ${
                    activityType === option.type ? 'text-primary-500 font-medium' : 'text-gray-400'
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Distance Target Slider */}
        <View className="mb-6">
          <Controller
            control={control}
            name="targetValue"
            render={({ field: { onChange, value } }) => (
              <Slider
                value={value}
                onValueChange={onChange}
                minimumValue={1}
                maximumValue={20}
                step={0.5}
                label="Distance Target"
                valueLabel={`${value.toFixed(1)} KM`}
                minLabel="1 KM"
                maxLabel="20 KM"
              />
            )}
          />
          {errors.targetValue && (
            <Text className="text-red-500 text-sm mt-1">{errors.targetValue.message}</Text>
          )}
        </View>

        {/* Screen Time Reward Slider */}
        <View className="mb-8">
          <Controller
            control={control}
            name="rewardMinutes"
            render={({ field: { onChange, value } }) => (
              <Slider
                value={value}
                onValueChange={(val) => onChange(Math.round(val))}
                minimumValue={5}
                maximumValue={120}
                step={5}
                label="Screen Time Reward"
                valueLabel={`${value} MIN`}
                minLabel="5 MIN"
                maxLabel="120 MIN"
              />
            )}
          />
          {errors.rewardMinutes && (
            <Text className="text-red-500 text-sm mt-1">{errors.rewardMinutes.message}</Text>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="px-4 pt-4 bg-background-primary border-t border-border-subtle"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          onPress={handleSubmit(onSubmit)}
          isLoading={createGoal.isPending}
          icon="arrow-forward"
        >
          Create Goal
        </Button>
      </View>
    </View>
  );
}
