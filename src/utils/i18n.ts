import i18n from "i18next";
import { getLocales } from "expo-localization";
import { initReactI18next } from "react-i18next";
import { AppLanguage, resources } from "@/src/locales";

const DEFAULT_LANGUAGE: AppLanguage = "en";

const resolveInitialLanguage = (): AppLanguage => {
  const locale = getLocales()[0];
  const code = locale?.languageCode?.toLowerCase();

  if (code === "hy" || code === "ru" || code === "en") {
    return code;
  }

  return DEFAULT_LANGUAGE;
};

void i18n.use(initReactI18next).init({
  resources,
  lng: resolveInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
