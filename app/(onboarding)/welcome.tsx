import { View, Text, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    router.push('/(onboarding)/consistency');
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Ambient glow effect */}
      <View className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-primary-500/10 via-background-primary/50 to-background-primary" />
      <View
        className="absolute top-1/4 left-1/2 w-[300px] h-[300px] rounded-full bg-primary-500/20 blur-3xl"
        style={{ transform: [{ translateX: -150 }] }}
      />

      {/* Hero Image Placeholder */}
      <View className="flex-1 items-center justify-center px-6 pt-8">
        <View className="w-full max-w-sm aspect-[3/4] rounded-3xl bg-background-secondary border border-border-subtle overflow-hidden items-center justify-center">
          <View className="items-center">
            <Text className="text-6xl mb-4">🏃</Text>
            <Text className="text-primary-500 text-lg font-semibold">Move to Earn</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="px-6 pb-4">
        <Text className="text-4xl font-extrabold text-white text-center leading-tight mb-3">
          What if screen time was something you{' '}
          <Text className="text-primary-500 italic">earned?</Text>
        </Text>

        <Text className="text-lg text-gray-300 text-center font-light mb-8">
          Turn your daily movement into rewards you actually want.
        </Text>

        <Button onPress={handleContinue}>
          Let's find out how
        </Button>

        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="mt-4 py-2 items-center">
            <Text className="text-gray-400 text-sm font-semibold">
              I already have an account
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
