import { useState, useCallback } from "react";
import { View, Text, Pressable, Platform, Image } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";

// Required for OAuth redirect handling
WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = "oauth_google" | "oauth_apple";

interface SocialButtonProps {
  provider: "google" | "apple";
  onPress: () => void;
  isLoading: boolean;
}

function SocialButton({ provider, onPress, isLoading }: SocialButtonProps) {
  const isGoogle = provider === "google";

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={`flex-1 h-14 rounded-xl bg-background-tertiary items-center justify-center flex-row gap-2.5 ${
        isLoading ? "opacity-50" : "active:opacity-80"
      }`}
    >
      <Ionicons
        name={isGoogle ? "logo-google" : "logo-apple"}
        size={20}
        color="#ffffff"
      />
    </Pressable>
  );
}

export function SocialAuthButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState("");

  const { startOAuthFlow: startGoogleOAuth } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({
    strategy: "oauth_apple",
  });

  const handleOAuthSignIn = useCallback(
    async (strategy: OAuthStrategy) => {
      setError("");
      setIsLoading(strategy);

      try {
        const startOAuth =
          strategy === "oauth_google" ? startGoogleOAuth : startAppleOAuth;
        const { createdSessionId, setActive } = await startOAuth();

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/");
        }
      } catch (err: unknown) {
        const oauthError = err as { errors?: Array<{ message: string }> };
        const message =
          oauthError.errors?.[0]?.message || "OAuth sign in failed";
        setError(message);
        console.error("OAuth error:", err);
      } finally {
        setIsLoading(null);
      }
    },
    [startGoogleOAuth, startAppleOAuth, router],
  );

  // Only show Apple on iOS
  const showApple = Platform.OS === "ios";

  return (
    <View>
      <View className={`flex-row gap-3 ${!showApple ? "justify-center" : ""}`}>
        {showApple && (
          <SocialButton
            provider="apple"
            onPress={() => handleOAuthSignIn("oauth_apple")}
            isLoading={isLoading === "oauth_apple"}
          />
        )}
        <SocialButton
          provider="google"
          onPress={() => handleOAuthSignIn("oauth_google")}
          isLoading={isLoading === "oauth_google"}
        />
      </View>
      {error ? (
        <Text className="text-red-500 text-sm text-center mt-3">{error}</Text>
      ) : null}
    </View>
  );
}
