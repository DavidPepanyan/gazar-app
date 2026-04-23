import { useTranslation } from "@/src/hooks/UseTranslation";
import { fetchCurrentUserProfile } from "@/src/services/user.service";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface EditProfileFields {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const hasFetchedProfileRef = React.useRef(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [fields, setFields] = React.useState<EditProfileFields>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const loadProfile = React.useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const token = await getToken();
      if (!token) {
        setIsError(true);
        return;
      }
      const data = await fetchCurrentUserProfile(token);
      if (!data) {
        setIsError(true);
        return;
      }

      setFields({
        firstName: data.name?.trim() ?? "",
        lastName: data.lastName?.trim() ?? "",
        phoneNumber: data.phone?.trim() ?? "",
      });
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || hasFetchedProfileRef.current) {
      return;
    }

    hasFetchedProfileRef.current = true;
    void loadProfile();
  }, [isLoaded, isSignedIn, loadProfile]);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <SafeAreaView  edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("editProfile.title"),
          headerTitleAlign: "left",
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center px-5">
            <ActivityIndicator size="small" color="#7ac943" />
            <Text className="mt-2 text-sm text-gray-500">{t("editProfile.loading")}</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerClassName="px-5 pt-4 pb-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="mb-6 text-sm leading-6 text-gray-600">
              {t("editProfile.subtitle")}
            </Text>

            {isError ? (
            <View className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
              <Text className="text-sm leading-6 text-red-600">{t("editProfile.error")}</Text>
              <Pressable
                onPress={() => void loadProfile()}
                className="mt-3 self-start rounded-full bg-primary px-4 py-2"
              >
                <Text className="text-sm font-semibold text-white">{t("editProfile.retry")}</Text>
              </Pressable>
            </View>
            ) : (
              <View className="rounded-3xl border border-primary/15 px-4 py-4">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  {t("editProfile.firstNameLabel")}
                </Text>
                <TextInput
                  placeholder={t("editProfile.firstNamePlaceholder")}
                  placeholderTextColor="#9CA3AF"
                  value={fields.firstName}
                  onChangeText={(firstName) => setFields((prev) => ({ ...prev, firstName }))}
                  className="rounded-2xl bg-gray-100 px-4 py-4 text-base"
                  autoCapitalize="words"
                />

                <Text className="mt-4 mb-2 text-sm font-semibold text-gray-700">
                  {t("editProfile.lastNameLabel")}
                </Text>
                <TextInput
                  placeholder={t("editProfile.lastNamePlaceholder")}
                  placeholderTextColor="#9CA3AF"
                  value={fields.lastName}
                  onChangeText={(lastName) => setFields((prev) => ({ ...prev, lastName }))}
                  className="rounded-2xl bg-gray-100 px-4 py-4 text-base"
                  autoCapitalize="words"
                />

                <Text className="mt-4 mb-2 text-sm font-semibold text-gray-700">
                  {t("editProfile.phoneLabel")}
                </Text>
                <TextInput
                  placeholder={t("editProfile.phonePlaceholder")}
                  placeholderTextColor="#9CA3AF"
                  value={fields.phoneNumber}
                  onChangeText={(phoneNumber) => setFields((prev) => ({ ...prev, phoneNumber }))}
                  className="rounded-2xl bg-gray-100 px-4 py-4 text-base"
                  keyboardType="phone-pad"
                />
              </View>
            )}

            <Pressable
              onPress={() => router.back()}
              className="mt-6 items-center rounded-2xl bg-primary/15 px-4 py-3"
            >
              <Text className="text-sm font-semibold text-gray-800">
                {t("editProfile.doneForNow")}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
