import { Platform } from 'react-native';
import { AppSelectionViewIOS } from './AppSelectionView.ios';
import { AppSelectionViewAndroid } from './AppSelectionView.android';

export interface AppSelectionViewProps {
  initialSelection?: string;
  onSelectionChange: (selection: string | null, appCount: number, categoryCount: number) => void;
  onError?: (error: Error) => void;
  style?: object;
}

/**
 * Platform-specific app selection view.
 * iOS: Wraps DeviceActivitySelectionView from react-native-device-activity
 * Android: Placeholder UI (not implemented)
 */
export const AppSelectionView = Platform.select({
  ios: AppSelectionViewIOS,
  android: AppSelectionViewAndroid,
  default: AppSelectionViewAndroid,
})!;
