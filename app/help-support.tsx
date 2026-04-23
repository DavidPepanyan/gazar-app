import { useTranslation } from "@/src/hooks/UseTranslation";
import { Stack, useRouter } from "expo-router";
import { ChevronDown, ChevronLeft, Mail, MapPin, Phone } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function HelpSupportScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [expandedFaqId, setExpandedFaqId] = React.useState<string | null>("1");

  const faqItems: FaqItem[] = [
    {
      id: "1",
      question: t("helpSupport.faq.q1"),
      answer: t("helpSupport.faq.a1"),
    },
    {
      id: "2",
      question: t("helpSupport.faq.q2"),
      answer: t("helpSupport.faq.a2"),
    },
    {
      id: "3",
      question: t("helpSupport.faq.q3"),
      answer: t("helpSupport.faq.a3"),
    },
    {
      id: "4",
      question: t("helpSupport.faq.q4"),
      answer: t("helpSupport.faq.a4"),
    },
  ];

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/more");
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: t("helpSupport.headerTitle"),
          headerTitleAlign: "left",
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={handleGoBack}
              className="h-10 w-10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel={t("helpSupport.backButtonA11y")}
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
          {t("helpSupport.title")}
        </Text>

        <View className="rounded-3xl border border-primary/15 px-4 py-2">
          <View className="border-b border-gray-200 py-4">
            <View className="flex-row items-center gap-2">
              <Phone size={16} color="#7ac943" />
              <Text className="text-base font-bold text-gray-900">
                {t("helpSupport.contact.phoneLabel")}
              </Text>
            </View>
            <Text className="mt-2 text-sm leading-6 text-gray-700">
              {t("helpSupport.contact.phoneValue")}
            </Text>
          </View>

          <View className="border-b border-gray-200 py-4">
            <View className="flex-row items-center gap-2">
              <Mail size={16} color="#7ac943" />
              <Text className="text-base font-bold text-gray-900">
                {t("helpSupport.contact.emailLabel")}
              </Text>
            </View>
            <Text className="mt-2 text-sm leading-6 text-gray-700">
              {t("helpSupport.contact.emailValue")}
            </Text>
          </View>

          <View className="py-4">
            <View className="flex-row items-center gap-2">
              <MapPin size={16} color="#7ac943" />
              <Text className="text-base font-bold text-gray-900">
                {t("helpSupport.contact.addressLabel")}
              </Text>
            </View>
            <Text className="mt-2 text-sm leading-6 text-gray-700">
              {t("helpSupport.contact.addressValue")}
            </Text>
          </View>
        </View>

        <View className="mt-8">
          <Text className="mb-4 text-2xl leading-8 font-bold text-gray-900">
            {t("helpSupport.faq.title")}
          </Text>

          <View className="rounded-3xl border border-primary/15 px-3 py-1">
            {faqItems.map((item, index) => {
              const isExpanded = expandedFaqId === item.id;
              const isLast = index === faqItems.length - 1;

              return (
                <View
                  key={item.id}
                  className={!isLast ? "border-b border-gray-200" : ""}
                >
                  <Pressable
                    onPress={() => toggleFaq(item.id)}
                    className="flex-row items-center justify-between py-4"
                    accessibilityRole="button"
                    accessibilityLabel={item.question}
                  >
                    <Text className="flex-1 pr-3 text-sm font-semibold leading-5 text-gray-900">
                      {item.question}
                    </Text>
                    <ChevronDown
                      size={18}
                      color="#6b7280"
                      style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
                    />
                  </Pressable>

                  {isExpanded ? (
                    <Text className="pb-4 text-sm leading-6 text-gray-600">
                      {item.answer}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
