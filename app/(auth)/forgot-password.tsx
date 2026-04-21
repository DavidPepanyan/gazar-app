import { useSignIn } from "@clerk/expo";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function ForgotPassword() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const handleSendCode = async () => {
    setFormError("");

    const { error: createError } = await signIn.create({
      identifier: email.trim(),
    });
    if (createError) {
      setFormError(createError.message || "Could not start reset flow.");
      return;
    }

    const { error: sendCodeError } =
      await signIn.resetPasswordEmailCode.sendCode();
    if (sendCodeError) {
      setFormError(sendCodeError.message || "Could not send reset code.");
      return;
    }

    router.push({
      pathname: "/(auth)/reset-password",
      params: { email: email.trim() },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white px-8 justify-center">
        <Text className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </Text>

        {!!formError && (
          <Text className="text-red-500 text-center mb-4">{formError}</Text>
        )}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="rounded-2xl px-4 py-4 mb-6 text-base bg-gray-200 leading-0 "
        />

        <Pressable
          onPress={handleSendCode}
          disabled={!email || fetchStatus === "fetching"}
          className="bg-primary py-4 rounded-2xl items-center opacity-100 disabled:opacity-50"
        >
          <Text className="text-white font-semibold text-base">
            Send reset code
          </Text>
        </Pressable>
      </View>
    </>
  );
}
