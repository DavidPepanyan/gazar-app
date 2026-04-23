import { useTranslation } from "@/src/hooks/UseTranslation";
import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const sections = [
    {
      title: t("privacyPolicy.collectionTitle"),
      body: t("privacyPolicy.collectionBody"),
    },
    {
      title: t("privacyPolicy.usageTitle"),
      body: t("privacyPolicy.usageBody"),
    },
    {
      title: t("privacyPolicy.nonDisclosureTitle"),
      body: t("privacyPolicy.nonDisclosureBody"),
    },
  ];
  const termsSections = [
    {
      title: t("termsOfUse.eligibilityTitle"),
      body: t("termsOfUse.eligibilityBody"),
    },
    {
      title: t("termsOfUse.communicationTitle"),
      body: t("termsOfUse.communicationBody"),
    },
    {
      title: t("termsOfUse.linksTitle"),
      body: t("termsOfUse.linksBody"),
    },
    {
      title: t("termsOfUse.returnsTitle"),
      body: t("termsOfUse.returnsBody"),
    },
    {
      title: t("termsOfUse.liabilityTitle"),
      body: t("termsOfUse.liabilityBody"),
    },
  ];
  const orderDeliverySections = [
    {
      title: t("orderDelivery.howToOrderTitle"),
      body: t("orderDelivery.howToOrderBody"),
    },
    {
      title: t("orderDelivery.shippingTermsTitle"),
      body: t("orderDelivery.shippingTermsBody"),
    },
    {
      title: t("orderDelivery.returnPolicyTitle"),
      body: t("orderDelivery.returnPolicyBody"),
    },
  ];

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/more");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: t("privacyPolicy.headerTitle"),
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={handleGoBack}
              className="h-10 w-10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel={t("privacyPolicy.backButtonA11y")}
            >
              <ChevronLeft size={20} color="#111827" />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerClassName="px-5 pt-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 text-2xl leading-8 font-bold text-gray-900">
          {t("privacyPolicy.title")}
        </Text>

        <View className="rounded-3xl border border-primary/15 bg-primary/3 px-4 py-4">
          <Text className="text-sm leading-6 text-gray-700">
            {t("privacyPolicy.intro")}
          </Text>
        </View>

        <View className="mt-4 gap-3">
          {sections.map((section, index) => (
            <View
              key={section.title}
              className="rounded-3xl border border-primary/15 bg-white px-4 py-4"
            >
              <View className="flex-row items-center gap-2">
                <View className="h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                  <Text className="text-[11px] font-bold text-primary">{index + 1}</Text>
                </View>
                <Text className="flex-1 text-base font-bold text-gray-900">
                  {section.title}
                </Text>
              </View>
              <Text className="mt-2 text-sm leading-6 text-gray-700">{section.body}</Text>
            </View>
          ))}
        </View>

        <View className="mt-8">
          <Text className="mb-4 text-2xl leading-8 font-bold text-gray-900">
            {t("termsOfUse.title")}
          </Text>

          <View className="rounded-3xl border border-primary/15 bg-primary/3 px-4 py-4">
            <Text className="text-sm leading-6 text-gray-700">{t("termsOfUse.intro")}</Text>
          </View>

          <View className="mt-4 gap-3">
            {termsSections.map((section, index) => (
              <View
                key={section.title}
                className="rounded-3xl border border-primary/15 bg-white px-4 py-4"
              >
                <View className="flex-row items-center gap-2">
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                    <Text className="text-[11px] font-bold text-primary">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-base font-bold text-gray-900">
                    {section.title}
                  </Text>
                </View>
                <Text className="mt-2 text-sm leading-6 text-gray-700">{section.body}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-8">
          <Text className="mb-4 text-2xl leading-8 font-bold text-gray-900">
            {t("orderDelivery.title")}
          </Text>

          <View className="rounded-3xl border border-primary/15 bg-primary/3 px-4 py-4">
            <Text className="text-sm leading-6 text-gray-700">
              {t("orderDelivery.intro")}
            </Text>
          </View>

          <View className="mt-4 gap-3">
            {orderDeliverySections.map((section, index) => (
              <View
                key={section.title}
                className="rounded-3xl border border-primary/15 bg-white px-4 py-4"
              >
                <View className="flex-row items-center gap-2">
                  <View className="h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                    <Text className="text-[11px] font-bold text-primary">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-base font-bold text-gray-900">
                    {section.title}
                  </Text>
                </View>
                <Text className="mt-2 text-sm leading-6 text-gray-700">{section.body}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
