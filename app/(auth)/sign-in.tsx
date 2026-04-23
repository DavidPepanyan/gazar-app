import { useAuth, useSignIn } from "@clerk/expo";
import { Image } from "expo-image";
import { Redirect, Stack, useRouter } from "expo-router";
import React from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useTranslation } from "@/src/hooks/UseTranslation";

export default function SignIn() {
  const { signIn, fetchStatus } = useSignIn();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [resendMessage, setResendMessage] = React.useState("");
  const [isResendPressed, setIsResendPressed] = React.useState(false);

  const isMfaStep =
    signIn.status === "needs_client_trust" ||
    signIn.status === "needs_second_factor";

  const handleSignIn = async () => {
    setFormError("");
    setResendMessage("");

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      const msg = error.message || t("auth.signIn.errors.failed");

      if (msg.toLowerCase().includes("password")) {
        setFormError(t("auth.signIn.errors.invalidPassword"));
      } else if (msg.toLowerCase().includes("identifier")) {
        setFormError(t("auth.signIn.errors.emailNotFound"));
      } else {
        setFormError(msg);
      }
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

    if (
      signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor"
    ) {
      await signIn.mfa.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    setFormError("");
    setResendMessage("");

    const { error } = await signIn.mfa.verifyEmailCode({
      code,
    });

    if (error) {
      setFormError(t("auth.common.errors.invalidVerificationCode"));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: () => {
          router.replace("/(tabs)/home");
        },
      });
    }
  };

  const handleResendCode = async () => {
    setFormError("");
    setResendMessage("");

    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      setFormError(t("auth.common.errors.resendCodeFailed"));
      return;
    }

    setResendMessage(t("auth.common.resendCodeSuccess"));
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 bg-white px-8">
              {/* LOGO */}
              <View className="items-center mt-20">
                <Image
                  source={require("../../assets/images/logos/logo.png")}
                  style={{ width: 120, height: 100 }}
                  contentFit="contain"
                />
              </View>

              {/* TITLE */}
              <Text className="text-2xl font-bold text-center mt-28 mb-8 text-gray-800">
                {isMfaStep ? t("auth.common.verifyCodeTitle") : t("auth.signIn.title")}
              </Text>

              {/* ERROR */}
              {!!formError && (
                <View className="bg-red-100 border border-red-300 px-4 py-3 rounded-2xl mb-4">
                  <Text className="text-red-600 text-center font-medium">
                    {formError}
                  </Text>
                </View>
              )}

              {/* FORM */}
              {!isMfaStep ? (
                <View>
                  <TextInput
                    placeholder={t("auth.common.emailPlaceholder")}
                    placeholderTextColor="#9CA3AF"
                    className="rounded-2xl px-4 py-4 mb-4 text-base bg-gray-200 leading-0 "
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                  />
                  <Pressable
                    onPress={() => router.push("/(auth)/forgot-password")}
                    className="self-end mb-3"
                  >
                    <Text className="text-primary font-medium">
                      {t("auth.signIn.forgotPassword")}
                    </Text>
                  </Pressable>

                  <TextInput
                    placeholder={t("auth.common.passwordPlaceholder")}
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    className="rounded-2xl px-4 py-4 mb-6 text-base bg-gray-200 leading-0 "
                    value={password}
                    onChangeText={setPassword}
                  />

                  <Pressable
                    onPress={handleSignIn}
                    disabled={
                      !emailAddress || !password || fetchStatus === "fetching"
                    }
                    className="bg-primary py-4 rounded-2xl items-center mb-4 opacity-100 disabled:opacity-50"
                  >
                    <Text className="text-white font-semibold text-base">
                      {t("auth.signIn.continue")}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View>
                  <TextInput
                    placeholder={t("auth.common.verificationCodePlaceholder")}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    className="rounded-2xl px-4 py-4 mb-6 text-base bg-gray-200 leading-0 "
                    value={code}
                    onChangeText={setCode}
                  />

                  <Pressable
                    onPress={handleVerify}
                    disabled={fetchStatus === "fetching"}
                    className="bg-primary py-4 rounded-2xl items-center mb-4"
                  >
                    <Text className="text-white font-semibold text-base">
                      {t("auth.common.verify")}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleResendCode}
                    onPressIn={() => setIsResendPressed(true)}
                    onPressOut={() => setIsResendPressed(false)}
                    className={`items-center py-1 ${
                      isResendPressed ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    <Text className="text-center text-gray-500">
                      {t("auth.common.resendCode")}
                    </Text>
                  </Pressable>
                  {!!resendMessage && (
                    <Text className="text-center text-green-600 mt-2">
                      {resendMessage}
                    </Text>
                  )}

                  <Pressable onPress={() => signIn.reset()}>
                    <Text className="text-center text-gray-400 mt-4">
                      {t("auth.common.startOver")}
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* FOOTER */}
              <View className="mt-auto items-center pb-28">
                <Text className="text-gray-500">
                  {t("auth.signIn.noAccount")}{" "}
                  <Text
                    className="text-primary font-semibold"
                    onPress={() => router.push("/(auth)/sign-up")}
                  >
                    {t("auth.signIn.signUp")}
                  </Text>
                </Text>
              </View>

              <View nativeID="clerk-captcha" />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
