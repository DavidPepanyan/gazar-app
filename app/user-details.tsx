import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/expo";
import { Stack, useRouter, Redirect } from "expo-router";
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
const USER_DETAILS_ENDPOINT = "https://gazar.am/api/user/me";

export default function UserDetailsScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [submitError, setSubmitError] = React.useState("");

  const {
    control,
    handleSubmit,
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

  const handleSaveUserDetails = async (values: UserDetailsFormValues) => {
    setSubmitError("");

    const token = await getToken();
    if (!token) {
      setSubmitError("Could not authorize your session. Please sign in again.");
      return;
    }

    try {
      const payload = {
        name: values.firstName,
        lastName: values.lastName,
        phone: values.phoneNumber,
      };
      const response = await fetch(USER_DETAILS_ENDPOINT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let apiMessage = "Could not save your details. Please try again.";

        try {
          const errorData = (await response.json()) as { message?: string };
          if (errorData.message) {
            apiMessage = errorData.message;
          }
        } catch {
          // Keep fallback message when response body is not JSON.
        }

        setSubmitError(apiMessage);
        return;
      }

      router.replace("/(tabs)/home");
    } catch {
      setSubmitError("Could not save your details. Please try again.");
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
                className="bg-[#7ac943] py-4 rounded-2xl items-center mt-8 opacity-100 disabled:opacity-50"
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
