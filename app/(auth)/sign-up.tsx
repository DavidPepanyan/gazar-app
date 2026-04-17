import { useAuth, useSignUp } from "@clerk/expo";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
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

export default function Register() {
  const { signUp, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const isVerifyStep =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address") &&
    signUp.missingFields?.length === 0;

  const handleSignUp = async () => {
    setFormError("");

    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) {
      setFormError(
        error.message?.includes("password")
          ? "Password is too weak or was found in a breach. Try another one."
          : error.message || "Sign up failed",
      );
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    setFormError("");

    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      setFormError("Invalid verification code");
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => {
          router.replace("/(tabs)/home");
        },
      });
    }
  };

  if (signUp.status === "complete" || isSignedIn) return null;

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
                {isVerifyStep ? "Verify code" : "Create Account"}
              </Text>

              {/* ERROR */}
              {!!formError && (
                <Text className="text-red-500 text-center mb-4">
                  {formError}
                </Text>
              )}

              {/* FORM */}
              {!isVerifyStep ? (
                <View>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-2xl px-4 py-4 mb-4 text-base bg-gray-200"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                  />

                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    className="rounded-2xl px-4 py-4 mb-6 text-base bg-gray-200"
                    value={password}
                    onChangeText={setPassword}
                  />

                  <Pressable
                    onPress={handleSignUp}
                    disabled={
                      !emailAddress || !password || fetchStatus === "fetching"
                    }
                    className="bg-[#7ac943] py-4 rounded-2xl items-center mb-4 opacity-100 disabled:opacity-50"
                  >
                    <Text className="text-white font-semibold text-base">
                      Sign up
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View>
                  <TextInput
                    placeholder="Verification code"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    className="rounded-2xl px-4 py-4 mb-6 text-base bg-gray-200"
                    value={code}
                    onChangeText={setCode}
                  />

                  <Pressable
                    onPress={handleVerify}
                    disabled={fetchStatus === "fetching"}
                    className="bg-[#7ac943] py-4 rounded-2xl items-center mb-4"
                  >
                    <Text className="text-white font-semibold text-base">
                      Verify
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => signUp.verifications.sendEmailCode()}
                  >
                    <Text className="text-center text-gray-500">
                      Resend code
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* GOOGLE UI
              <Pressable className="flex-row justify-center items-center gap-2 mt-6">
                <Image
                  source={{
                    uri: "https://developers.google.com/identity/images/g-logo.png",
                  }}
                  style={{ width: 18, height: 18 }}
                />
                <Text className="text-gray-500">Sign Up with Google</Text>
              </Pressable> */}

              {/* FOOTER */}
              <View className="mt-auto items-center pb-28">
                <Text className="text-gray-500">
                  If you already have an account?{" "}
                  <Text
                    className="text-[#7ac943] font-semibold"
                    onPress={() => router.push("/(auth)/sign-in")}
                  >
                    Sign In
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
