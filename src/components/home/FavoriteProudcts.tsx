import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { QuantitySelector } from "../shared/QuantitySelector";
import { useBasketStore } from "../../store/basket.store";
import {
  fetchHomeFavoriteProducts,
  HomeFavoriteProduct,
} from "../../services/home.service";

const formatPrice = (value: number): string => `${value.toLocaleString()} AMD`;

const getDiscountedPrice = (product: HomeFavoriteProduct): number => {
  if (!product.discountActive || product.discount <= 0) {
    return product.price;
  }

  if (product.discountType === "PERCENT") {
    return Math.max(0, Math.round(product.price * (1 - product.discount / 100)));
  }

  return Math.max(0, product.price - product.discount);
};

export const FavoriteProudcts = React.memo(() => {
  const [products, setProducts] = React.useState<HomeFavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [quantities, setQuantities] = React.useState<Record<number, number>>({});
  const [addingState, setAddingState] = React.useState<Record<number, boolean>>({});
  const addItem = useBasketStore((state) => state.addItem);
  const addTimeoutsRef = React.useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const loadFavoriteProducts = React.useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchHomeFavoriteProducts("EN");
      setProducts(data);
      setQuantities(() =>
        Object.fromEntries(data.map((product) => [product.id, product.minLimit])),
      );
    } catch {
      setProducts([]);
      setQuantities({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadFavoriteProducts();
  }, [loadFavoriteProducts]);

  React.useEffect(() => {
    const timeoutMap = addTimeoutsRef.current;

    return () => {
      Object.values(timeoutMap).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  const updateQuantity = React.useCallback((productId: number, nextValue: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: nextValue,
    }));
  }, []);

  const handleAddToBasket = React.useCallback(
    (product: HomeFavoriteProduct) => {
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

  if (isLoading) {
    return (
      <View className="mt-4">
        <View className="mx-6 mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">Favorite products</Text>
        </View>
        <View className="mx-6 h-[120px] items-center justify-center rounded-3xl bg-gray-50">
          <ActivityIndicator size="small" color="#7ac943" />
        </View>
      </View>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <View className="mt-4">
      <View className="mx-6 mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">Favorite products</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-6"
      >
        {products.map((product, index) => {
          const currentQuantity = quantities[product.id] ?? product.minLimit;
          const discountedPrice = getDiscountedPrice(product);
          const hasDiscount = product.discountActive && discountedPrice < product.price;
          const isAdding = addingState[product.id] ?? false;

          return (
            <View
              key={product.id}
              className={`w-[180px] rounded-3xl border border-primary/10 bg-white p-3 ${
                index === products.length - 1 ? "" : "mr-3"
              }`}
            >
              <View className="relative h-[120px] w-full overflow-hidden rounded-2xl ">
                {product.image ? (
                  <Image
                    source={{ uri: product.image }}
                    contentFit="contain"
                    className="h-full w-full"
                    style={{ width: 160 , height: 120 }}
                  />
                ) : (
                  <View className="h-full w-full items-center justify-center">
                    <Text className="text-xs font-semibold text-gray-500">No image</Text>
                  </View>
                )}

                {hasDiscount ? (
                  <View className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1">
                    <Text className="text-xs font-bold text-white">Sale</Text>
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
                accessibilityLabel={`Add ${product.title} to basket`}
                onPress={() => handleAddToBasket(product)}
                disabled={isAdding}
                className="mt-3 min-h-[44px] items-center justify-center rounded-full bg-primary"
              >
                {isAdding ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-sm font-bold text-white">Add to basket</Text>
                )}
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});

FavoriteProudcts.displayName = "FavoriteProudcts";
