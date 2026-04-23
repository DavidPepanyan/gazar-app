import { useSignIn } from "@clerk/expo";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useTranslation } from "@/src/hooks/UseTranslation";

export default function ForgotPassword() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const handleSendCode = async () => {
    setFormError("");

    const { error: createError } = await signIn.create({
      identifier: email.trim(),
    });
    if (createError) {
      setFormError(createError.message || t("auth.forgotPassword.errors.startFailed"));
      return;
    }

    const { error: sendCodeError } =
      await signIn.resetPasswordEmailCode.sendCode();
    if (sendCodeError) {
      setFormError(sendCodeError.message || t("auth.forgotPassword.errors.sendCodeFailed"));
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
          {t("auth.forgotPassword.title")}
        </Text>

        {!!formError && (
          <Text className="text-red-500 text-center mb-4">{formError}</Text>
        )}

        <TextInput
          placeholder={t("auth.common.emailPlaceholder")}
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
            {t("auth.forgotPassword.sendCode")}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
