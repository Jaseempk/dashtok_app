// This is a placeholder for the center FAB button in the tab bar.
// Navigation is handled by the custom tabBarButton in _layout.tsx.
// This file exists only to satisfy Expo Router's file-based routing.

import { Redirect } from 'expo-router';

export default function FabPlaceholder() {
  return <Redirect href="/(app)/(tabs)" />;
}
