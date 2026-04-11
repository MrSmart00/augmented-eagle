import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "./i18n";
import type { SupportedLanguage } from "./i18n";

interface UseLanguageReturn {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
}

export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();

  const language = (i18n.language as SupportedLanguage) || "ja";

  const changeLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    },
    [i18n],
  );

  return { language, changeLanguage };
}
