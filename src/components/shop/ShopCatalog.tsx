import { useRouter } from "expo-router";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "@/src/hooks/UseTranslation";
import { useBasketStore } from "@/src/store/basket.store";
import { Categories } from "../home/Categories";
import { QuantitySelector } from "../shared/QuantitySelector";
import { fetchShopProducts, ShopProduct } from "@/src/services/shop.service";
import { HomeCategory } from "@/src/services/home.service";

const formatPrice = (value: number): string => `${value.toLocaleString()} AMD`;

const getDiscountedPrice = (product: ShopProduct): number => {
  if (!product.discountActive || product.discount <= 0) {
    return product.price;
  }

  if (product.discountType === "PERCENT") {
    return Math.max(0, Math.round(product.price * (1 - product.discount / 100)));
  }

  return Math.max(0, product.price - product.discount);
};

interface ShopCatalogProps {
  selectedCategoryId?: number | null;
}

export const ShopCatalog = React.memo<ShopCatalogProps>(({ selectedCategoryId = null }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = React.useState<ShopProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);
  const [quantities, setQuantities] = React.useState<Record<number, number>>({});
  const [addingState, setAddingState] = React.useState<Record<number, boolean>>({});
  const addItem = useBasketStore((state) => state.addItem);
  const addTimeoutsRef = React.useRef<Record<number, ReturnType<typeof setTimeout>>>({});
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

  React.useEffect(() => {
    const timeoutMap = addTimeoutsRef.current;

    return () => {
      Object.values(timeoutMap).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  const loadProducts = React.useCallback(async () => {
    setIsLoadingProducts(true);

    try {
      const data = await fetchShopProducts(apiLanguage, selectedCategoryId ?? undefined);
      setProducts(data);
      setQuantities(() =>
        Object.fromEntries(data.map((product) => [product.id, product.minLimit])),
      );
    } catch {
      setProducts([]);
      setQuantities({});
    } finally {
      setIsLoadingProducts(false);
    }
  }, [apiLanguage, selectedCategoryId]);

  React.useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const updateQuantity = React.useCallback((productId: number, nextValue: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: nextValue,
    }));
  }, []);

  const handleAddToBasket = React.useCallback(
    (product: ShopProduct) => {
      if (addingState[product.id]) {
        return;
      }

      const selectedQuantity = quantities[product.id] ?? product.minLimit;
      setAddingState((prev) => ({ ...prev, [product.id]: true }));

      addItem({
        id: product.id,
        slug: product.slug,
        name: product.title,
        description: product.category,
        price: product.price,
        discount: product.discount,
        discountType: product.discountType,
        discountActive: product.discountActive,
        image: product.image,
        weight: product.weight,
        unit: product.unit,
        minLimit: product.minLimit,
        maxLimit: product.maxLimit,
        quantity: selectedQuantity,
      });

      const timerId = setTimeout(() => {
        setAddingState((prev) => ({ ...prev, [product.id]: false }));
        delete addTimeoutsRef.current[product.id];
      }, 700);

      addTimeoutsRef.current[product.id] = timerId;
    },
    [addItem, addingState, quantities],
  );

  const handleSelectCategory = React.useCallback(
    (category: HomeCategory) => {
      if (selectedCategoryId === category.id) {
        return;
      }

      const nextRoute = {
        pathname: "/(tabs)/shop" as const,
        params: { categoryId: String(category.id) },
      };
      if (selectedCategoryId === null) {
        router.push(nextRoute);
        return;
      }

      router.replace(nextRoute);
    },
    [router, selectedCategoryId],
  );

  return (
    <View className="flex-1 bg-white pt-14">
      <ScrollView
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-6 mb-1">
          <Text className="text-2xl font-bold text-gray-900">{t("shop.title")}</Text>
        </View>

        <Categories
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {isLoadingProducts ? (
          <View className="mx-6 mt-4 h-[120px] items-center justify-center rounded-3xl bg-gray-50">
            <ActivityIndicator size="small" color="#7ac943" />
            <Text className="mt-2 text-sm text-gray-500">{t("shop.loadingProducts")}</Text>
          </View>
        ) : !products.length ? (
          <View className="mx-6 mt-4 h-[120px] items-center justify-center rounded-3xl bg-gray-50">
            <Text className="text-sm text-gray-500">{t("shop.noProducts")}</Text>
          </View>
        ) : (
          <View className="mx-6 mt-4 flex-row flex-wrap justify-between">
            {products.map((product) => {
              const currentQuantity = quantities[product.id] ?? product.minLimit;
              const discountedPrice = getDiscountedPrice(product);
              const hasDiscount = product.discountActive && discountedPrice < product.price;
              const isAdding = addingState[product.id] ?? false;

              return (
                <View
                  key={product.id}
                  className="mb-3 w-[48%] rounded-3xl border border-primary/10 bg-white p-3"
                >
                  <View className="relative h-[120px] w-full overflow-hidden rounded-2xl">
                    {product.image ? (
                      <Image
                        source={{ uri: product.image }}
                        contentFit="contain"
                        className="h-full w-full"
                        style={{ width: 160, height: 120 }}
                      />
                    ) : (
                      <View className="h-full w-full items-center justify-center">
                        <Text className="text-xs font-semibold text-gray-500">
                          {t("home.product.noImage")}
                        </Text>
                      </View>
                    )}

                    {hasDiscount ? (
                      <View className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1">
                        <Text className="text-xs font-bold text-white">{t("home.product.sale")}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text
                    numberOfLines={2}
                    className="mt-3 min-h-[40px] text-sm font-bold text-gray-900"
                  >
                    {product.title}
                  </Text>

                  <View className="mt-2 flex-row items-center">
                    <Text className="text-base font-bold text-primary">
                      {formatPrice(discountedPrice)}
                    </Text>
                    {hasDiscount ? (
                      <Text className="ml-2 text-xs text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </Text>
                    ) : null}
                  </View>

                  <View className="mt-3">
                    <QuantitySelector
                      value={currentQuantity}
                      min={product.minLimit}
                      max={product.maxLimit}
                      onChange={(nextValue) => updateQuantity(product.id, nextValue)}
                      unit={product.unit}
                    />
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t("home.product.addToBasketA11y", {
                      title: product.title,
                    })}
                    onPress={() => handleAddToBasket(product)}
                    disabled={isAdding}
                    className="mt-3 min-h-[44px] items-center justify-center rounded-full bg-primary"
                  >
                    {isAdding ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="text-sm font-bold text-white">
                        {t("home.product.addToBasket")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
});

ShopCatalog.displayName = "ShopCatalog";
