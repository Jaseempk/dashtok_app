import { View, Image, ImageSourcePropType } from 'react-native';
import { ReactNode } from 'react';

interface OnboardingHeroProps {
  imageSource?: ImageSourcePropType;
  fallbackContent?: ReactNode;
  aspectRatio?: '4:3' | '3:4' | 'square';
  showGlow?: boolean;
}

const aspectRatioMap = {
  '4:3': 'aspect-[4/3]',
  '3:4': 'aspect-[3/4]',
  'square': 'aspect-square',
};

export function OnboardingHero({
  imageSource,
  fallbackContent,
  aspectRatio = '4:3',
  showGlow = false,
}: OnboardingHeroProps) {
  return (
    <View className="w-full items-center justify-center py-4">
      <View
        className={`relative w-full max-w-[280px] ${aspectRatioMap[aspectRatio]} rounded-2xl overflow-hidden bg-background-secondary border border-border-subtle`}
      >
        {/* Glow effect */}
        {showGlow && (
          <View
            className="absolute inset-0 bg-primary-500/10"
            style={{
              shadowColor: '#00f5d4',
              shadowRadius: 40,
              shadowOpacity: 0.3,
            }}
          />
        )}

        {/* Gradient overlay */}
        <View className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent z-10" />

        {imageSource ? (
          <Image
            source={imageSource}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : fallbackContent ? (
          <View className="w-full h-full items-center justify-center">
            {fallbackContent}
          </View>
        ) : null}
      </View>
    </View>
  );
}
