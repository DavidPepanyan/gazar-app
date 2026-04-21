import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    fetchCurrentUserProfile,
    UserProfile,
} from "../../../src/services/user.service";

export default function Home() {
  const { getToken } = useAuth();
  const [apiUser, setApiUser] = React.useState<UserProfile | null>(null);
  const hasLoadedRef = React.useRef(false);

  const loadUserDetails = React.useCallback(async () => {
    const token = await getToken();
    if (!token) {
      return;
    }

    try {
      const data = await fetchCurrentUserProfile(token);
      setApiUser(data);
    } catch {
      // Keep Clerk data fallback when API is unavailable.
    }
  }, [getToken]);

  React.useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }
    hasLoadedRef.current = true;
    void loadUserDetails();
  }, [loadUserDetails]);

  const userName = apiUser?.name || "Guest";
  const userInitial = userName[0].toUpperCase();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1  pt-16">
        <View className="mt-4 px-6 flex-row items-center  justify-between ">
          <View className="flex-row items-center gap-2">
            {apiUser?.image ? (
              <Image
                source={{ uri: apiUser.image }}
                contentFit="cover"
                style={{ width: 42, height: 42, borderRadius: 34 }}
                className="border border-gray-200 mr-4"
              />
            ) : (
              <View className="h-[42px] w-[42px] rounded-full border border-gray-200 bg-gray-100 items-center justify-center mr-4">
                <Text className="text-2xl font-bold text-gray-700">
                  {userInitial}
                </Text>
              </View>
            )}

            <Text className="text-lg leading-normal font-bold tracking-tight text-gray-900">
              Hello, {userName}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
