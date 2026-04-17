jest.unmock("react-i18next");

import { defineFeature, loadFeature } from "jest-cucumber";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { initI18n, SUPPORTED_LANGUAGES, STORAGE_KEY } from "@/src/shared/i18n/i18n";

const feature = loadFeature("__tests__/shared/features/i18n.feature");

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    if (i18n.isInitialized) {
      await i18n.changeLanguage("ja");
    }
  });

  test("デフォルト言語が日本語で初期化される", ({ given, when, then }) => {
    given("AsyncStorageが空である", () => {
      // already cleared in beforeEach
    });

    when("i18nを初期化する", async () => {
      await initI18n();
    });

    then(/^言語が "(.*)" である$/, (lang: string) => {
      expect(i18n.language).toBe(lang);
    });
  });

  test("AsyncStorageに保存された言語で初期化される", ({
    given,
    when,
    then,
  }) => {
    given(
      /^AsyncStorageに言語 "(.*)" が保存されている$/,
      async (lang: string) => {
        await AsyncStorage.setItem(STORAGE_KEY, lang);
      }
    );

    when("i18nを初期化する", async () => {
      await initI18n();
    });

    then(/^言語が "(.*)" である$/, (lang: string) => {
      expect(i18n.language).toBe(lang);
    });
  });

  test("不正な言語が保存されていた場合はデフォルトの日本語で初期化される", ({
    given,
    when,
    then,
  }) => {
    given(
      /^AsyncStorageに言語 "(.*)" が保存されている$/,
      async (lang: string) => {
        await AsyncStorage.setItem(STORAGE_KEY, lang);
      }
    );

    when("i18nを初期化する", async () => {
      await initI18n();
    });

    then(/^言語が "(.*)" である$/, (lang: string) => {
      expect(i18n.language).toBe(lang);
    });
  });

  test("日本語の翻訳キーが正しく解決される", ({ given, then, and }) => {
    given("i18nが初期化されている", async () => {
      await initI18n();
    });

    then(
      /^翻訳キー "(.*)" が "(.*)" に解決される$/,
      (key: string, value: string) => {
        expect(i18n.t(key)).toBe(value);
      }
    );

    and(
      /^翻訳キー "(.*)" が "(.*)" に解決される$/,
      (key: string, value: string) => {
        expect(i18n.t(key)).toBe(value);
      }
    );
  });

  test("英語に切り替えると英語の翻訳が返される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("i18nが初期化されている", async () => {
      await initI18n();
    });

    when(/^言語を "(.*)" に切り替える$/, async (lang: string) => {
      await i18n.changeLanguage(lang);
    });

    then(
      /^翻訳キー "(.*)" が "(.*)" に解決される$/,
      (key: string, value: string) => {
        expect(i18n.t(key)).toBe(value);
      }
    );

    and(
      /^翻訳キー "(.*)" が "(.*)" に解決される$/,
      (key: string, value: string) => {
        expect(i18n.t(key)).toBe(value);
      }
    );
  });

  test("日本語に戻すと日本語の翻訳が返される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("i18nが初期化されている", async () => {
      await initI18n();
    });

    when(/^言語を "(.*)" に切り替える$/, async (lang: string) => {
      await i18n.changeLanguage(lang);
    });

    and(/^言語を "(.*)" に切り替える$/, async (lang: string) => {
      await i18n.changeLanguage(lang);
    });

    then(
      /^翻訳キー "(.*)" が "(.*)" に解決される$/,
      (key: string, value: string) => {
        expect(i18n.t(key)).toBe(value);
      }
    );
  });

  test("SUPPORTED_LANGUAGESに日本語と英語が含まれる", ({ then }) => {
    then(
      /^SUPPORTED_LANGUAGESが "(.*)" と "(.*)" を含む$/,
      (lang1: string, lang2: string) => {
        expect(SUPPORTED_LANGUAGES).toEqual([lang1, lang2]);
      }
    );
  });
});
