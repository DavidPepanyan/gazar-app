import en from "./en.json";
import hy from "./hy.json";
import ru from "./ru.json";

export const resources = {
  en: { translation: en },
  hy: { translation: hy },
  ru: { translation: ru },
} as const;

export type AppLanguage = keyof typeof resources;
