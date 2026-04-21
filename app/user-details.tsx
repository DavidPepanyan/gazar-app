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
import {
    fetchCurrentUserProfile,
    updateCurrentUserProfile,
} from "../src/services/user.service";

const userDetailsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
});

type UserDetailsFormValues = z.infer<typeof userDetailsSchema>;

export default function UserDetailsScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [submitError, setSubmitError] = React.useState("");

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
    },
  });

  React.useEffect(() => {
    const loadInitialValues = async () => {
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
        });
      } catch {
        // Keep empty defaults if fetch fails.
      }
    };

    if (isLoaded && isSignedIn) {
      void loadInitialValues();
    }
  }, [getToken, isLoaded, isSignedIn, reset]);

  const handleSaveUserDetails = async (values: UserDetailsFormValues) => {
    setSubmitError("");

    const token = await getToken();
    if (!token) {
      setSubmitError("Could not authorize your session. Please sign in again.");
      return;
    }

    try {
      await updateCurrentUserProfile(token, {
        name: values.firstName,
        lastName: values.lastName,
        phone: values.phoneNumber,
      });

      router.replace("/(tabs)/home");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not save your details. Please try again.",
      );
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
                Complete Your Profile
              </Text>
              <Text className="text-center text-gray-500 mt-3 mb-10">
                Add your first name, last name, and phone number.
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
                      placeholder="First name"
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
                      placeholder="Last name"
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
                      placeholder="Phone number"
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

              <Pressable
                onPress={handleSubmit(handleSaveUserDetails)}
                disabled={!isValid || isSubmitting}
                className="bg-primary py-4 rounded-2xl items-center mt-8 opacity-100 disabled:opacity-50"
                accessibilityRole="button"
                accessibilityLabel="Continue to app"
              >
                <Text className="text-white font-semibold text-base">
                  {isSubmitting ? "Saving..." : "Continue"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}
