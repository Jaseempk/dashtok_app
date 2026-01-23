import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable, Icon, IconName } from '@/components/ui';
import { ActivityType } from '../store/onboardingStore';

type BadgeVariant = 'amber' | 'neutral';
type TargetIcon = 'time' | 'flash' | 'heart';

interface ActivityTypeCardProps {
  type: ActivityType;
  title: string;
  badge: string;
  badgeVariant: BadgeVariant;
  targetText: string;
  targetIcon: TargetIcon;
  image: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
}

const TARGET_ICONS: Record<TargetIcon, IconName> = {
  time: 'time',
  flash: 'flash',
  heart: 'heart',
};

export function ActivityTypeCard({
  title,
  badge,
  badgeVariant,
  targetText,
  targetIcon,
  image,
  selected,
  onPress,
}: ActivityTypeCardProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      className={`rounded-xl overflow-hidden ${
        selected
          ? 'border border-primary-500'
          : 'border border-border-subtle'
      }`}
      style={selected ? {
        shadowColor: '#00f5d4',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      } : undefined}
    >
      <View className="flex-row h-32">
        {/* Image Section */}
        <View className="w-1/3 relative overflow-hidden">
          <Image
            source={image}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
            style={!selected ? { opacity: 0.7 } : undefined}
          />
          {/* Cyan overlay */}
          <View
            className="absolute inset-0"
            style={{
              backgroundColor: selected ? 'rgba(0, 245, 212, 0.25)' : 'rgba(0, 245, 212, 0.15)',
            }}
          />
          {/* Gradient fade to right */}
          <LinearGradient
            colors={['transparent', selected ? 'rgba(0, 245, 212, 0.05)' : 'rgba(26, 33, 48, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute inset-0"
          />
        </View>

        {/* Content Section */}
        <View className={`flex-1 p-4 justify-center ${
          selected ? 'bg-primary-500/5' : 'bg-background-secondary'
        }`}>
          {/* Title Row */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className={`text-lg font-semibold ${
              selected ? 'text-white' : 'text-white'
            }`}>
              {title}
            </Text>
            {/* Selection indicator */}
            {selected ? (
              <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
                <Icon name="check" size="sm" color="#0a0f1a" />
              </View>
            ) : (
              <View className="w-6 h-6 rounded-full border-2 border-gray-600" />
            )}
          </View>

          {/* Badge */}
          <View
            className={`self-start px-2 py-0.5 rounded mb-2 ${
              badgeVariant === 'amber'
                ? 'bg-amber-500/10 border border-amber-500/20'
                : 'bg-white/5 border border-white/10'
            }`}
          >
            <Text
              className={`text-[10px] font-bold tracking-wider uppercase ${
                badgeVariant === 'amber' ? 'text-amber-400' : 'text-gray-400'
              }`}
            >
              {badge}
            </Text>
          </View>

          {/* Target Info */}
          <View className="flex-row items-center gap-1.5">
            <Icon
              name={TARGET_ICONS[targetIcon]}
              size="sm"
              color="#00f5d4"
            />
            <Text className="text-gray-400 text-xs">
              Target:{' '}
              <Text className={selected ? 'text-primary-500 font-semibold' : 'text-white'}>
                {targetText}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}
