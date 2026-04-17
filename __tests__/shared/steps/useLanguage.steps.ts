jest.unmock("react-i18next");

import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "@/src/shared/i18n/useLanguage";
import { initI18n, STORAGE_KEY } from "@/src/shared/i18n/i18n";
import type { SupportedLanguage } from "@/src/shared";

const feature = loadFeature("__tests__/shared/features/useLanguage.feature");

defineFeature(feature, (test) => {
  let result: ReturnType<typeof renderHook<ReturnType<typeof useLanguage>, unknown>>["result"];

  beforeEach(async () => {
    await AsyncStorage.clear();
    await initI18n();
  });

  test("現在の言語を返す", ({ given, when, then }) => {
    given("i18nが初期化されている", () => {
      // done in beforeEach
    });

    when("useLanguageフックを実行する", () => {
      const hook = renderHook(() => useLanguage());
      result = hook.result;
    });

    then(/^言語が "(.*)" である$/, (lang: string) => {
      expect(result.current.language).toBe(lang);
    });
  });

  test("言語を変更するとi18nextの言語が更新される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("i18nが初期化されている", () => {
      // done in beforeEach
    });

    when("useLanguageフックを実行する", () => {
      const hook = renderHook(() => useLanguage());
      result = hook.result;
    });

    and(/^言語を "(.*)" に変更する$/, async (lang: string) => {
      await act(async () => {
        await result.current.changeLanguage(lang as SupportedLanguage);
      });
    });

    then(/^言語が "(.*)" である$/, (lang: string) => {
      expect(result.current.language).toBe(lang);
    });
  });

  test("言語変更がAsyncStorageに保存される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("i18nが初期化されている", () => {
      // done in beforeEach
    });

    when("useLanguageフックを実行する", () => {
      const hook = renderHook(() => useLanguage());
      result = hook.result;
    });

    and(/^言語を "(.*)" に変更する$/, async (lang: string) => {
      await act(async () => {
        await result.current.changeLanguage(lang as SupportedLanguage);
      });
    });

    then(/^AsyncStorageに "(.*)" が保存されている$/, async (lang: string) => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      expect(saved).toBe(lang);
    });
  });
});
