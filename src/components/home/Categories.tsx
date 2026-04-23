import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useTranslation } from "@/src/hooks/UseTranslation";
import {
  fetchHomeCategories,
  HomeCategory,
} from "../../services/home.service";

export const Categories = React.memo(() => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = React.useState<HomeCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const apiLanguage = React.useMemo(() => {
    const language = (i18n.resolvedLanguage || i18n.language || "en").toLowerCase();
    if (language.startsWith("hy")) {
      return "HY";
    }
    if (language.startsWith("ru")) {
      return "RU";
    }
    return "EN";
  }, [i18n.language, i18n.resolvedLanguage]);

  const loadCategories = React.useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchHomeCategories(apiLanguage);
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiLanguage]);

  React.useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  if (isLoading) {
    return (
      <View className="mt-4">
        <View className="mx-6 mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">{t("home.categoriesTitle")}</Text>
        </View>
        <View className="mx-6 h-[92px] items-center justify-center rounded-3xl bg-gray-50">
          <ActivityIndicator size="small" color="#7ac943" />
        </View>
      </View>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <View className="mt-4">
      <View className="mx-6 mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">{t("home.categoriesTitle")}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-6"
            
      >
        {categories.map((category, index) => (
          <View
            key={category.id}
            className={`w-[84px] items-center ${index === categories.length - 1 ? "" : "mr-3"}`}
          >
            <View className="h-[84px] w-[84px] items-center justify-center rounded-full bg-primary/15">
              {category.image ? (
                <Image
                  source={{ uri: category.image }}
                  contentFit="contain"
                  className="h-[60px] w-[60px]"
                  style={{ width: 60, height: 60 }}
                />
              ) : (
                <Text className="text-sm font-bold text-primary">
                  {category.title[0]?.toUpperCase() || "C"}
                </Text>
              )}
            </View>

            <Text
              className="mt-2 text-center text-xs font-medium text-gray-700"
              numberOfLines={2}
            >
              {category.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

Categories.displayName = "Categories";
