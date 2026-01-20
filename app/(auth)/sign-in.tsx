import { useState, useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui";
import { AuthInput } from "@/components/auth";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (!isLoaded || !signIn) return;

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        console.log("Sign in status:", result.status);
        setError("Additional verification required");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string }> };
      const message = clerkError.errors?.[0]?.message || "Failed to sign in";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, signIn, email, password, setActive, router]);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background-primary"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo & Branding */}
        <View className="items-center mb-8">
          <Image
            source={require("@/assets/images/DasherWhite.png")}
            className="w-20 h-20 mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-white">Dashtok</Text>
        </View>

        {/* Welcome Text */}
        <View className="items-center mb-8">
          <Text className="text-4xl font-bold text-white italic">
            Welcome Back
          </Text>
          <Text className="text-sm text-primary-500 font-medium tracking-widest uppercase mt-2">
            Earn Your Screen Time
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-background-secondary/60 border border-primary-500/20 rounded-2xl p-5 mb-6">
          <View className="gap-5">
            <AuthInput
              label="Email"
              icon="mail"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />

            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-primary-500 font-medium tracking-widest uppercase">
                  Password
                </Text>
                <Pressable hitSlop={8}>
                  <Text className="text-xs text-gray-400">Forgot?</Text>
                </Pressable>
              </View>
              <AuthInput
                icon="lock"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>
          </View>

          {error ? (
            <Text className="text-red-500 text-sm mt-3 text-center">
              {error}
            </Text>
          ) : null}

          <View className="mt-6">
            <Button
              onPress={handleSignIn}
              isLoading={isLoading}
              disabled={!isFormValid}
            >
              Sign In
            </Button>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border-subtle" />
            <Text className="mx-4 text-gray-500 text-xs uppercase tracking-wider">
              Or continue with
            </Text>
            <View className="flex-1 h-px bg-border-subtle" />
          </View>

          {/* Social Auth */}
          <SocialAuthButtons />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-400">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text className="text-primary-500 font-semibold">
                Create Account
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
