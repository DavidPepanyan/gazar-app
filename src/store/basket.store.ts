import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DiscountType = "PRICE" | "PERCENT" | string;
type ProductUnit = "pc" | "kg";

export interface BasketItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  discountType: DiscountType;
  discountActive: boolean;
  image: string;
  weight: number;
  unit: ProductUnit;
  minLimit: number | null;
  maxLimit: number | null;
  quantity: number;
}

export interface BasketItemInput extends Omit<BasketItem, "quantity"> {
  quantity?: number;
}

interface UpdateBasketItemQuantityParams {
  id: number;
  quantity: number;
}

export interface BasketStore {
  basket: BasketItem[];
  addItem: (item: BasketItemInput) => void;
  removeItem: (productId: number) => void;
  updateItemQuantity: (params: UpdateBasketItemQuantityParams) => void;
  clearBasket: () => void;
}

const secureStoreStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
}));

const resolveMinLimit = (item: BasketItemInput): number => {
  if (item.minLimit === null || item.minLimit <= 0) {
    return 1;
  }

  return item.minLimit;
};

const resolveMaxLimit = (item: BasketItemInput): number => {
  if (item.maxLimit === null || item.maxLimit < resolveMinLimit(item)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return item.maxLimit;
};

const clampQuantity = (quantity: number, item: BasketItemInput): number => {
  const min = resolveMinLimit(item);
  const max = resolveMaxLimit(item);

  if (quantity <= 0) {
    return 0;
  }

  return Math.min(max, Math.max(min, quantity));
};

const calculateDiscountedPrice = (item: Pick<
  BasketItem,
  "price" | "discount" | "discountType" | "discountActive"
>): number => {
  if (!item.discountActive || item.discount <= 0) {
    return item.price;
  }

  if (item.discountType === "PERCENT") {
    return Math.max(0, Math.round(item.price * (1 - item.discount / 100)));
  }

  return Math.max(0, item.price - item.discount);
};

export const useBasketStore = create<BasketStore>()(
  persist(
    (set) => ({
      basket: [],

      addItem: (item) =>
        set((state) => {
          const nextQuantity = clampQuantity(item.quantity ?? resolveMinLimit(item), item);

          if (nextQuantity <= 0) {
            return state;
          }

          const existingIndex = state.basket.findIndex(
            (basketItem) => basketItem.id === item.id,
          );

          const normalizedItem: BasketItem = {
            ...item,
            quantity: nextQuantity,
          };

          if (existingIndex === -1) {
            return { basket: [...state.basket, normalizedItem] };
          }

          const updatedBasket = [...state.basket];
          updatedBasket[existingIndex] = {
            ...updatedBasket[existingIndex],
            ...normalizedItem,
          };

          return { basket: updatedBasket };
        }),

      updateItemQuantity: ({ id, quantity }) =>
        set((state) => {
          const existingIndex = state.basket.findIndex((item) => item.id === id);

          if (existingIndex === -1) {
            return state;
          }

          const existingItem = state.basket[existingIndex];
          const nextQuantity = clampQuantity(quantity, existingItem);

          if (nextQuantity <= 0) {
            return {
              basket: state.basket.filter((item) => item.id !== id),
            };
          }

          const updatedBasket = [...state.basket];
          updatedBasket[existingIndex] = {
            ...existingItem,
            quantity: nextQuantity,
          };

          return { basket: updatedBasket };
        }),

      removeItem: (productId) =>
        set((state) => ({
          basket: state.basket.filter((product) => product.id !== productId),
        })),

      clearBasket: () => set({ basket: [] }),
    }),
    {
      name: "basket-storage",
      storage: secureStoreStorage,
      partialize: (state) => ({ basket: state.basket }),
    },
  ),
);

export const useBasketItems = (): BasketItem[] =>
  useBasketStore((state) => state.basket);

export const useBasketTotalItems = (): number =>
  useBasketStore((state) =>
    state.basket.reduce((acc, item) => acc + item.quantity, 0),
  );

export const useBasketTotalPrice = (): number =>
  useBasketStore((state) =>
    state.basket.reduce(
      (acc, item) => acc + calculateDiscountedPrice(item) * item.quantity,
      0,
    ),
  );
