import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

const ICON_MAP = {
  // Navigation
  'arrow-back': 'chevron-back',
  'arrow-forward': 'chevron-forward',
  'close': 'close',

  // Actions
  'check': 'checkmark',
  'check-circle': 'checkmark-circle',
  'add': 'add',
  'edit': 'create-outline',
  'location': 'location',

  // Activities
  'run': 'fitness',
  'walk': 'walk',
  'activity': 'body',

  // Features
  'calendar': 'calendar-outline',
  'time': 'time-outline',
  'phone': 'phone-portrait-outline',
  'lock': 'lock-closed',
  'unlock': 'lock-open',
  'chart': 'trending-up',
  'heart': 'heart',
  'heart-outline': 'heart-outline',
  'bell': 'notifications',
  'bell-outline': 'notifications-outline',

  // Status
  'success': 'checkmark-circle',
  'error': 'alert-circle',
  'warning': 'warning',
  'info': 'information-circle',

  // Auth
  'mail': 'mail-outline',
  'eye': 'eye-outline',
  'eye-off': 'eye-off-outline',

  // Misc
  'target': 'locate',
  'flame': 'flame',
  'trophy': 'trophy',
  'trophy-outline': 'trophy-outline',
  'star': 'star',
  'settings': 'settings-outline',
  'person': 'person-outline',
  'person-filled': 'person',
  'hourglass': 'hourglass-outline',
  'sparkles': 'sparkles',
  'bulb': 'bulb-outline',
  'chevron-down': 'chevron-down',
  'chevron-up': 'chevron-up',

  // Tab bar
  'home': 'home',
  'home-outline': 'home-outline',
  'stats': 'stats-chart',
  'stats-outline': 'stats-chart-outline',

  // Notifications
  'notifications': 'notifications',
  'notifications-outline': 'notifications-outline',
  'sunny': 'sunny-outline',
  'flash': 'flash-outline',
  'stats-chart': 'stats-chart-outline',

  // Activities
  'trash': 'trash-outline',
  'filter': 'options-outline',
  'stopwatch': 'stopwatch-outline',
  'speedometer': 'speedometer-outline',
  'footsteps': 'footsteps-outline',
  'bicycle': 'bicycle-outline',
  'shield-check': 'shield-checkmark',
  'cloud': 'cloud-outline',
  'hand': 'hand-left-outline',
  'flag': 'flag-outline',
} as const;

type IconName = keyof typeof ICON_MAP;

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const SIZE_MAP: Record<IconSize, number> = {
  'xs': 12,
  'sm': 16,
  'md': 20,
  'lg': 24,
  'xl': 32,
  '2xl': 40,
  '3xl': 48,
};

interface IconProps {
  name: IconName;
  size?: IconSize | number;
  color?: string;
  style?: ComponentProps<typeof Ionicons>['style'];
}

export function Icon({ name, size = 'md', color = '#ffffff', style }: IconProps) {
  const iconName = ICON_MAP[name];
  const iconSize = typeof size === 'number' ? size : SIZE_MAP[size];

  return (
    <Ionicons
      name={iconName}
      size={iconSize}
      color={color}
      style={style}
    />
  );
}

export type { IconName, IconSize };
