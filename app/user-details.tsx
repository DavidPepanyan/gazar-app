import { useAuth } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, Stack, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
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
import { z } from "zod";
import { useTranslation } from "@/src/hooks/UseTranslation";
import {
    fetchCurrentUserProfile,
    updateCurrentUserProfile,
} from "../src/services/user.service";

interface UserDetailsFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  companyTin: string;
}

export default function UserDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const hasLoadedInitialValuesRef = React.useRef(false);
  const [submitError, setSubmitError] = React.useState("");
  const userDetailsSchema = React.useMemo(
    () =>
      z.object({
        firstName: z
          .string()
          .trim()
          .min(1, t("userDetails.validation.firstNameRequired"))
          .min(2, t("userDetails.validation.firstNameMin")),
        lastName: z
          .string()
          .trim()
          .min(1, t("userDetails.validation.lastNameRequired"))
          .min(2, t("userDetails.validation.lastNameMin")),
        phoneNumber: z
          .string()
          .trim()
          .min(1, t("userDetails.validation.phoneRequired"))
          .regex(/^\+?[0-9]{7,15}$/, t("userDetails.validation.phoneInvalid")),
        companyName: z.string().trim(),
        companyTin: z.string().trim(),
      }),
    [t],
  );
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<UserDetailsFormValues>({
    resolver: zodResolver(userDetailsSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      companyName: "",
      companyTin: "",
    },
  });

  const loadInitialValues = React.useCallback(async () => {
    const token = await getToken();
    if (!token) {
      return;
    }

    try {
      const data = await fetchCurrentUserProfile(token);
      if (!data) {
        return;
      }

      reset({
        firstName: data.name?.trim() ?? "",
        lastName: data.lastName?.trim() ?? "",
        phoneNumber: data.phone?.trim() ?? "",
        companyName: data.companyName?.trim() ?? "",
        companyTin: data.companyTin?.trim() ?? "",
      });
    } catch {
      // Keep empty defaults if fetch fails.
    }
  }, [getToken, reset]);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || hasLoadedInitialValuesRef.current) {
      return;
    }

    hasLoadedInitialValuesRef.current = true;
    void loadInitialValues();
  }, [isLoaded, isSignedIn, loadInitialValues]);

  const handleSaveUserDetails = async (values: UserDetailsFormValues) => {
    setSubmitError("");

    const token = await getToken();
    if (!token) {
      setSubmitError(t("userDetails.errors.authFailed"));
      return;
    }

    try {
      const payload: Parameters<typeof updateCurrentUserProfile>[1] = {
        name: values.firstName,
        lastName: values.lastName,
        phone: values.phoneNumber,
        companyName: values.companyName.trim() || null,
        companyTin: values.companyTin.trim() || null,
      };

      await updateCurrentUserProfile(token, payload);

      router.replace("/(tabs)/home");
    } catch {
      setSubmitError(t("userDetails.errors.saveFailed"));
    }
  };

  if (!isLoaded) {
    return null;
  }
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerClassName="flex-grow"
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 bg-white px-8 pt-24 pb-12">
              <Text className="text-3xl font-bold text-center text-gray-800">
                {t("userDetails.title")}
              </Text>
              <Text className="text-center text-gray-500 mt-3 mb-10">
                {t("userDetails.subtitle")}
              </Text>

              {!!submitError && (
                <View className="bg-red-100 border border-red-300 px-4 py-3 rounded-2xl mb-4">
                  <Text className="text-red-600 text-center font-medium">
                    {submitError}
                  </Text>
                </View>
              )}

              <Controller
                control={control}
                name="firstName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <TextInput
                      placeholder={t("userDetails.firstNamePlaceholder")}
                      placeholderTextColor="#9CA3AF"
                      className="rounded-2xl px-4 py-4 text-base bg-gray-200"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                    />
                    {!!errors.firstName && (
                      <Text className="text-red-500 mt-2 mb-4">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <TextInput
                      placeholder={t("userDetails.lastNamePlaceholder")}
                      placeholderTextColor="#9CA3AF"
                      className="rounded-2xl px-4 py-4 text-base bg-gray-200 mt-2"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                    />
                    {!!errors.lastName && (
                      <Text className="text-red-500 mt-2 mb-4">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <TextInput
                      placeholder={t("userDetails.phonePlaceholder")}
                      placeholderTextColor="#9CA3AF"
                      className="rounded-2xl px-4 py-4 text-base bg-gray-200 mt-2"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                    />
                    {!!errors.phoneNumber && (
                      <Text className="text-red-500 mt-2 mb-4">
                        {errors.phoneNumber.message}
                      </Text>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="companyName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    placeholder={t("userDetails.companyNamePlaceholder")}
                    placeholderTextColor="#9CA3AF"
                    className="rounded-2xl px-4 py-4 text-base bg-gray-200 mt-2"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />

              <Controller
                control={control}
                name="companyTin"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    placeholder={t("userDetails.companyTinPlaceholder")}
                    placeholderTextColor="#9CA3AF"
                    className="rounded-2xl px-4 py-4 text-base bg-gray-200 mt-2"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />

              <Pressable
                onPress={handleSubmit(handleSaveUserDetails)}
                disabled={!isValid || isSubmitting}
                className="bg-primary py-4 rounded-2xl items-center mt-8 opacity-100 disabled:opacity-50"
                accessibilityRole="button"
                accessibilityLabel={t("userDetails.continueA11y")}
              >
                <Text className="text-white font-semibold text-base">
                  {isSubmitting ? t("userDetails.saving") : t("userDetails.continue")}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
