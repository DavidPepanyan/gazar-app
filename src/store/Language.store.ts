import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import i18n from "@/src/utils/i18n";
import { AppLanguage } from "@/src/locales";

interface LanguageState {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
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

const isSupportedLanguage = (value: string): value is AppLanguage =>
  value === "en" || value === "ru" || value === "hy";

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: isSupportedLanguage(i18n.language) ? i18n.language : "en",
      setLanguage: async (language) => {
        await i18n.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: "language-storage",
      storage: secureStoreStorage,
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (!state?.language) {
          return;
        }

        void i18n.changeLanguage(state.language);
      },
    },
  ),
);
