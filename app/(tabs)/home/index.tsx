import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerSlider } from "../../../src/components/home/BannerSlider";
import { Categories } from "../../../src/components/home/Categories";
import { DeliveryInfo } from "../../../src/components/home/DeliveryInfo";
import { FavoriteProudcts } from "../../../src/components/home/FavoriteProudcts";
import {
  fetchHomeMainSlider,
  HomeBanner,
} from "../../../src/services/home.service";
import {
  fetchCurrentUserProfile,
  UserProfile,
} from "../../../src/services/user.service";

export default function Home() {
  const { getToken } = useAuth();
  const [apiUser, setApiUser] = React.useState<UserProfile | null>(null);
  const [banners, setBanners] = React.useState<HomeBanner[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = React.useState(true);
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

  const loadBanners = React.useCallback(async () => {
    setIsLoadingBanners(true);
    try {
      const data = await fetchHomeMainSlider("EN");
      setBanners(data);
    } catch {
      setBanners([]);
    } finally {
      setIsLoadingBanners(false);
    }
  }, []);

  React.useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;
    void loadUserDetails();
    void loadBanners();
  }, [loadUserDetails, loadBanners]);

  const userName = apiUser?.name || "Guest";
  const userInitial = userName[0]?.toUpperCase() || "G";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="flex-1 bg-white pt-16"
      edges={["top"]}>
        <ScrollView
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-4 px-6 flex-row items-center justify-between border-b border-primary/15 pb-2">
            <View className="flex-row items-center gap-2">
              {apiUser?.image ? (
                <Image
                  source={{ uri: apiUser.image }}
                  contentFit="cover"
                  className="mr-4 h-[42px] w-[42px] rounded-full border border-gray-200"
                  style={{ width: 42, height: 42, borderRadius: 34 }}
                />
              ) : (
                <View className="mr-4 h-[42px] w-[42px] items-center justify-center rounded-full border border-gray-200 bg-gray-100">
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

          <View className="mt-4">
            {isLoadingBanners ? (
              <View className="mx-6 h-[160px] items-center justify-center rounded-3xl bg-orange-50">
                <ActivityIndicator size="small" color="#ff7a00" />
                <Text className="mt-2 text-sm text-primary">
                  Loading offers...
                </Text>
              </View>
            ) : (
              <BannerSlider banners={banners} />
            )}
          </View>

          <Categories />
          <DeliveryInfo />
          <FavoriteProudcts />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
