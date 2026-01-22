import { Platform } from 'react-native';
import { enforcementServiceIOS } from './enforcementService.ios';
import { enforcementServiceAndroid } from './enforcementService.android';

/**
 * Platform-specific enforcement service.
 * iOS: Full implementation using FamilyControls/ManagedSettings/DeviceActivity
 * Android: Stub (not implemented yet)
 */
export const enforcementService = Platform.select({
  ios: enforcementServiceIOS,
  android: enforcementServiceAndroid,
  default: enforcementServiceAndroid,
})!;

export type EnforcementService = typeof enforcementService;
