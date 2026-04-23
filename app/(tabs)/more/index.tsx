import { useTranslation } from "@/src/hooks/UseTranslation";
import { useAuth, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
    ChevronRight,
    CircleHelp,
    History,
    Languages,
    LogOut,
    Shield,
    UserRoundPen,
} from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    fetchCurrentUserProfile,
    UserProfile,
} from "../../../src/services/user.service";

const menuItems = [
  {
    key: "edit-profile",
    titleKey: "more.menu.editProfile.title",
    subtitleKey: "more.menu.editProfile.subtitle",
    icon: UserRoundPen,
  },

  {
    key: "order-history",
    titleKey: "more.menu.orderHistory.title",
    subtitleKey: "more.menu.orderHistory.subtitle",
    icon: History,
  },
  {
    key: "language",
    titleKey: "more.menu.language.title",
    subtitleKey: "more.menu.language.subtitle",
    icon: Languages,
  },
  {
    key: "privacy-security",
    titleKey: "more.menu.privacySecurity.title",
    subtitleKey: "more.menu.privacySecurity.subtitle",
    icon: Shield,
  },
  {
    key: "help-support",
    titleKey: "more.menu.helpSupport.title",
    subtitleKey: "more.menu.helpSupport.subtitle",
    icon: CircleHelp,
  },
  {
    key: "logout",
    titleKey: "more.menu.logout.title",
    subtitleKey: "more.menu.logout.subtitle",
    icon: LogOut,
  },
] as const;

export default function MoreScreen() {
  const { t } = useTranslation();
  const { getToken, signOut } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [apiUser, setApiUser] = React.useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [isProfileError, setIsProfileError] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const hasLoadedRef = React.useRef(false);

  const loadUserDetails = React.useCallback(async () => {
    setIsLoadingProfile(true);
    setIsProfileError(false);

    const token = await getToken();
    if (!token) {
      setIsProfileError(true);
      setIsLoadingProfile(false);
      return;
    }

    try {
      const data = await fetchCurrentUserProfile(token);
      if (!data) {
        setIsProfileError(true);
      }
      setApiUser(data);
    } catch {
      setIsProfileError(true);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [getToken]);

  React.useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;
    void loadUserDetails();
  }, [loadUserDetails]);

  const userName =
    apiUser?.name || user?.fullName || user?.firstName || t("more.profile.guestUser");
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || t("more.profile.guestEmail");
  const userImage = apiUser?.image || user?.imageUrl;

  const handleRetry = React.useCallback(() => {
    void loadUserDetails();
  }, [loadUserDetails]);

  const handleMenuPress = React.useCallback(
    async (
      title: string,
      key:
        | "edit-profile"
        | "order-history"
        | "language"
        | "privacy-security"
        | "help-support"
        | "logout",
    ) => {
      if (key === "language") {
        router.push("/language");
        return;
      }
      if (key === "privacy-security") {
        router.push("/privacy-policy");
        return;
      }

      if (key !== "logout") {
        Alert.alert(
          t("more.alerts.pressedTitle"),
          t("more.alerts.pressedDescription", { title }),
        );
        return;
      }

      if (isLoggingOut) {
        return;
      }

      try {
        setIsLoggingOut(true);
        await signOut();
      } catch {
        Alert.alert(
          t("more.alerts.logoutFailedTitle"),
          t("more.alerts.logoutFailedDescription"),
        );
      } finally {
        setIsLoggingOut(false);
      }
    },
    [isLoggingOut, router, signOut, t],
  );
  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <ScrollView
        contentContainerClassName="px-5 pt-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 text-2xl leading-7 font-bold text-gray-900">
          {t("more.title")}
        </Text>

        <View className="mb-6 rounded-3xl border border-primary/15 px-4 py-4">
          <View className="mb-3 flex-row items-center gap-3">
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                contentFit="cover"
                className="h-14 w-14 rounded-full"
                style={{ width: 42, height: 42, borderRadius: 34 }}
              />
            ) : (
              <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
                <Text className="text-lg font-bold text-gray-700">
                  {userName[0]?.toUpperCase() || "U"}
                </Text>
              </View>
            )}

            <View className="flex-1">
              <Text className="text-lg leading-6 font-bold text-gray-900">
                {userName}
              </Text>
              <Text className="mt-1 text-sm leading-5 text-gray-600">
                {userEmail}
              </Text>
            </View>
          </View>

          {isLoadingProfile ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#7ac943" />
              <Text className="text-sm leading-5 text-gray-500">
                {t("more.profile.loading")}
              </Text>
            </View>
          ) : isProfileError ? (
            <View className="flex-row items-center justify-between gap-2">
              <Text className="flex-1 text-sm leading-5 text-red-500">
                {t("more.profile.error")}
              </Text>
              <Pressable
                onPress={handleRetry}
                className="rounded-full bg-primary/15 px-3 py-1.5"
              >
                <Text className="text-xs font-bold text-white">
                  {t("more.profile.retry")}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View className="rounded-3xl border border-primary/15 px-3 py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === menuItems.length - 1;

            return (
              <Pressable
                key={item.key}
                className={`flex-row items-center justify-between py-4 ${
                  !isLast ? "border-b border-gray-300" : ""
                }`}
                onPress={() => void handleMenuPress(t(item.titleKey), item.key)}
              >
                <View className="flex-1 flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/80">
                    <Icon size={20} color="#fff" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base leading-6 font-semibold text-gray-900">
                      {t(item.titleKey)}
                    </Text>
                    <Text className="text-[13px] line-clamp-1 leading-[18px] text-gray-600">
                      {t(item.subtitleKey)}
                    </Text>
                  </View>
                </View>

                <ChevronRight size={18} color="#6b7280" />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
