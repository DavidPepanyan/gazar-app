import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { QuantitySelector } from "../../../src/components/shared/QuantitySelector";
import {
  useBasketItems,
  useBasketStore,
  useBasketTotalItems,
  useBasketTotalPrice,
} from "../../../src/store/basket.store";

export default function BasketScreen() {
  const basketItems = useBasketItems();
  const totalItems = useBasketTotalItems();
  const totalPrice = useBasketTotalPrice();
  const updateItemQuantity = useBasketStore((state) => state.updateItemQuantity);
  const removeItem = useBasketStore((state) => state.removeItem);
  const clearBasket = useBasketStore((state) => state.clearBasket);

  const formatPrice = React.useCallback(
    (value: number): string => `${value.toLocaleString()} AMD`,
    [],
  );

  if (!basketItems.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-2xl font-bold text-gray-900">Basket</Text>
        <Text className="mt-2 text-center text-base text-gray-500">
          Your basket is empty.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pb-8 pt-14"
      >
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Basket</Text>
          <Pressable
            onPress={clearBasket}
            
            accessibilityRole="button"
            accessibilityLabel="Clear basket"
          >
            <Text className="text-sm font-semibold text-red-600">Clear all</Text>
          </Pressable>
        </View>

        <View className="mb-4 rounded-2xl border border-primary/15 p-4">
          <Text className="text-sm text-gray-700">Total items: {totalItems}</Text>
          <Text className="mt-1 text-lg font-bold text-primary">
            Total price: {formatPrice(totalPrice)}
          </Text>
        </View>

        {basketItems.map((item) => (
          <View
            key={item.id}
            className="mb-3 rounded-2xl border border-primary/15 bg-white p-3"
          >
            <View className="flex-row">
              <View className="h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-2xl ">
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    contentFit="contain"
                    className="h-full w-full"
                    style={{ width: 88, height: 88 }}
                  />
                ) : (
                  <Text className="text-xs text-gray-500">No image</Text>
                )}
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-gray-900" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text className="mt-1 text-xs text-gray-500" numberOfLines={1}>
                  {item.weight} {item.unit}
                </Text>
                <Text className="mt-2 text-base font-bold text-primary">
                  {formatPrice(item.price)}
                </Text>
              </View>
            </View>

            <View className="mt-3">
              <QuantitySelector
                value={item.quantity}
                min={item.minLimit ?? 1}
                max={item.maxLimit ?? 999}
                onChange={(nextValue) =>
                  updateItemQuantity({ id: item.id, quantity: nextValue })
                }
                unit={item.unit}
              />
            </View>

            <Pressable
              onPress={() => removeItem(item.id)}
              className="mt-3 min-h-[40px] items-center justify-center rounded-full bg-gray-100"
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name} from basket`}
            >
              <Text className="text-sm font-semibold text-gray-700">Remove</Text>
            </Pressable>
          </View>
        ))}

        <Link href="../checkout" asChild>
          <Pressable
            className="mt-2 min-h-[48px] items-center justify-center rounded-full bg-primary"
            accessibilityRole="button"
            accessibilityLabel="Go to checkout"
          >
            <Text className="text-base font-bold text-white">Checkout</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}
