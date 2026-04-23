import { useTranslation } from "@/src/hooks/UseTranslation";
import { AppLanguage } from "@/src/locales";
import { useLanguageStore } from "@/src/store/Language.store";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LanguageItem {
  code: AppLanguage;
  flag: number;
}

const languageItems: LanguageItem[] = [
  { code: "hy", flag: require("../assets/flags/armenia.png") },
  { code: "ru", flag: require("../assets/flags/russia.png") },
  { code: "en", flag: require("../assets/flags/usa.png") },
];

export default function LanguageScreen() {
  const { t } = useTranslation();
  const selectedLanguage = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleChangeLanguage = React.useCallback(
    async (language: AppLanguage) => {
      if (language === selectedLanguage) {
        return;
      }

      await setLanguage(language);
    },
    [selectedLanguage, setLanguage],
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("languageScreen.title"),
          headerTitleAlign: "left",
          headerShadowVisible: false,
        }}
      />

      <View className="px-5 py-0">
        <View className="rounded-3xl border border-primary/15 px-4 py-1">
          {languageItems.map((item, index) => {
            const isSelected = selectedLanguage === item.code;
            const isLast = index === languageItems.length - 1;

            return (
              <Pressable
                key={item.code}
                onPress={() => void handleChangeLanguage(item.code)}
                className={`min-h-[64px] flex-row items-center justify-between py-3 ${
                  !isLast ? "border-b border-gray-200" : ""
                }`}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={t(`languageScreen.items.${item.code}`)}
              >
                <View className="flex-row items-center gap-3">
                  <Image
                    source={item.flag}
                    contentFit="cover"
                    className="h-9 w-9 rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                    }}
                  />
                  <Text className="text-base font-semibold text-gray-900">
                    {t(`languageScreen.items.${item.code}`)}
                  </Text>
                </View>

                <View
                  className={`h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected ? "border-primary bg-primary" : "border-gray-300"
                  }`}
                >
                  {isSelected ? <Check size={14} color="#ffffff" /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
