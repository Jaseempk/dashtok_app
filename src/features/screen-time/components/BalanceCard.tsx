import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRemainingTime } from '../hooks/useRemainingTime';
import type { EnforcementStatus } from '../types/screenTime.types';

interface BalanceCardProps {
  status: EnforcementStatus | undefined;
  isLoading?: boolean;
}

/**
 * Circular balance card showing remaining screen time.
 * Matches the design from screen_time_allowance_tracking.
 */
export function BalanceCard({ status, isLoading }: BalanceCardProps) {
  const { formatted, totalSeconds } = useRemainingTime(
    status?.remainingMinutes,
    status?.isUnlocked
  );

  // Calculate progress percentage
  const totalMinutes = status?.totalMinutes ?? 0;
  const usedMinutes = status?.usedMinutes ?? 0;
  const remainingMinutes = status?.remainingMinutes ?? 0;
  const progressPercent = totalMinutes > 0
    ? ((totalMinutes - remainingMinutes) / totalMinutes) * 100
    : 0;

  // SVG circle parameters
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Format remaining time for display
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  // Determine status color and text
  const getStatusInfo = () => {
    if (!status || status.reason === 'no_blocked_apps') {
      return { color: '#9ca3af', text: 'Not Set Up', dotColor: '#9ca3af' };
    }
    if (status.reason === 'enforcement_disabled') {
      return { color: '#9ca3af', text: 'Disabled', dotColor: '#9ca3af' };
    }
    if (status.shouldBlock) {
      if (status.reason === 'goal_incomplete') {
        return { color: '#f59e0b', text: 'Locked', dotColor: '#f59e0b' };
      }
      return { color: '#ef4444', text: 'Time Up', dotColor: '#ef4444' };
    }
    return { color: '#00f5d4', text: 'Active', dotColor: '#22c55e' };
  };

  const statusInfo = getStatusInfo();

  if (isLoading) {
    return (
      <View className="items-center justify-center py-8 px-6 rounded-3xl bg-background-secondary">
        <View className="w-[200px] h-[200px] items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="items-center py-8 px-6 rounded-3xl bg-background-secondary">
      {/* Circular Progress */}
      <View className="relative items-center justify-center">
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1f2937"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle - cyan for used time */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#00f5d4"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
          {/* Bonus time indicator - orange segment */}
          {(status?.totalMinutes ?? 0) > 0 && usedMinutes < totalMinutes && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f97316"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${(((status?.totalMinutes ?? 0) - (status?.earnedMinutes ?? totalMinutes)) / totalMinutes) * circumference} ${circumference}`}
              strokeDashoffset={-strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
              opacity={0.7}
            />
          )}
        </Svg>

        {/* Center content */}
        <View className="absolute items-center justify-center">
          <Text className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Balance
          </Text>
          <Text
            className="text-4xl font-bold"
            style={{ color: statusInfo.color }}
          >
            {status?.isUnlocked ? formatted : timeDisplay}
          </Text>
          <View className="flex-row items-center mt-1">
            <View
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: statusInfo.dotColor }}
            />
            <Text
              className="text-sm font-medium"
              style={{ color: statusInfo.color }}
            >
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
