import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ja from "./locales/ja.json";
import en from "./locales/en.json";

export const STORAGE_KEY = "@augmented-eagle/language";

export type SupportedLanguage = "ja" | "en";

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ["ja", "en"] as const;

async function loadSavedLanguage(): Promise<SupportedLanguage> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved === "ja" || saved === "en") {
    return saved;
  }
  return "ja";
}

// 同期的にデフォルト言語で初期化（アプリ起動をブロックしない）
i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng: "ja",
  fallbackLng: "ja",
  interpolation: {
    escapeValue: false,
  },
});

// AsyncStorageから保存済み言語を読み込んで適用
export async function initI18n(): Promise<typeof i18n> {
  const lng = await loadSavedLanguage();
  if (lng !== i18n.language) {
    await i18n.changeLanguage(lng);
  }
  return i18n;
}

export default i18n;
