import { useState, useCallback, useEffect, Component, type ReactNode } from 'react';
import { View, Text, ActivityIndicator, Pressable } from 'react-native';
import { DeviceActivitySelectionView } from 'react-native-device-activity';
import { Icon } from '@/components/ui';
import type { AppSelectionViewProps } from './AppSelectionView';

// Error boundary for catching native view crashes
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error) => void;
  fallback: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * iOS App Selection View
 * Wraps Apple's DeviceActivitySelectionView with error handling and loading states.
 *
 * Note: This view can crash when browsing large categories or searching.
 * The ErrorBoundary catches these crashes and shows a fallback UI.
 */
export function AppSelectionViewIOS({
  initialSelection,
  onSelectionChange,
  onError,
  style,
}: AppSelectionViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(
    (error: Error) => {
      console.error('[AppSelectionView] Error:', error);
      setHasError(true);
      onError?.(error);
    },
    [onError]
  );

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  // Reset loading state when selection changes
  useEffect(() => {
    if (initialSelection !== undefined) {
      setIsLoading(false);
    }
  }, [initialSelection]);

  if (hasError) {
    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          },
          style,
        ]}
      >
        <View className="w-16 h-16 rounded-full bg-red-500/10 items-center justify-center mb-4">
          <Icon name="alert-circle" size="2xl" color="#ef4444" />
        </View>
        <Text className="text-lg font-semibold text-white text-center mb-2">
          Unable to load app picker
        </Text>
        <Text className="text-sm text-gray-400 text-center mb-6">
          Something went wrong while loading the app selection. This can happen
          when browsing large categories.
        </Text>
        <Pressable
          onPress={handleRetry}
          className="px-6 py-3 rounded-xl bg-primary-500 active:bg-primary-600"
        >
          <Text className="text-black font-semibold">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1 }, style]}>
      <ErrorBoundary
        onError={handleError}
        fallback={
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400">Loading failed. Tap to retry.</Text>
          </View>
        }
      >
        <DeviceActivitySelectionView
          familyActivitySelection={initialSelection}
          onSelectionChange={(event) => {
            setIsLoading(false);
            const selection = event.nativeEvent.familyActivitySelection;
            // Note: The native view doesn't provide app/category counts directly
            // We'll need to track these separately or estimate from the token
            onSelectionChange(
              selection || null,
              event.nativeEvent.applicationCount ?? 0,
              event.nativeEvent.categoryCount ?? 0
            );
          }}
          style={{ flex: 1, backgroundColor: 'transparent' }}
        />
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-background-primary/80">
            <ActivityIndicator size="large" color="#00f5d4" />
            <Text className="text-gray-400 mt-4">Loading apps...</Text>
          </View>
        )}
      </ErrorBoundary>
    </View>
  );
}
