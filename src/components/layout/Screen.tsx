import { View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  safeArea?: boolean;
}

export function Screen({ children, safeArea = true, className = '', ...props }: ScreenProps) {
  const Container = safeArea ? SafeAreaView : View;

  return (
    <Container
      className={`flex-1 bg-background-primary ${className}`}
      {...props}
    >
      {children}
    </Container>
  );
}
