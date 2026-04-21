import { useAuth, useSignIn } from "@clerk/expo";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function ResetPassword() {
  const { signIn, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const handleResetPassword = async () => {
    setFormError("");

    const { error: verifyError } =
      await signIn.resetPasswordEmailCode.verifyCode({
        code: code.trim(),
      });
    if (verifyError) {
      setFormError(verifyError.message || "Invalid verification code.");
      return;
    }

    const { error: submitError } =
      await signIn.resetPasswordEmailCode.submitPassword({
        password: newPassword,
      });
    if (submitError) {
      setFormError(submitError.message || "Could not reset password.");
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: () => {
          router.replace("/(tabs)/home");
        },
      });
      return;
    }

    if (isSignedIn) {
      router.replace("/(tabs)/home");
      return;
    }

    setFormError("Password updated, but your session was not completed.");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white px-8 justify-center">
        <Text className="text-2xl font-bold text-center mb-2">
          Reset Password
        </Text>
        {!!email && (
          <Text className="text-gray-500 text-center mb-6">{email}</Text>
        )}

        {!!formError && (
          <Text className="text-red-500 text-center mb-4">{formError}</Text>
        )}

        <TextInput
          placeholder="Verification code"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={code}
          onChangeText={setCode}
          className="rounded-2xl px-4 py-4 mb-4 text-base bg-gray-200 leading-0 "
        />

        <TextInput
          placeholder="New password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          className="rounded-2xl px-4 py-4 mb-6 text-base bg-gray-200 leading-0 "
        />

        <Pressable
          onPress={handleResetPassword}
          disabled={!code || !newPassword || fetchStatus === "fetching"}
          className="bg-primary py-4 rounded-2xl items-center opacity-100 disabled:opacity-50"
        >
          <Text className="text-white font-semibold text-base">
            Update password
          </Text>
        </Pressable>
      </View>
    </>
  );
}
