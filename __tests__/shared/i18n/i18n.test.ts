jest.unmock("react-i18next");

import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { initI18n, SUPPORTED_LANGUAGES, STORAGE_KEY } from "@/src/shared/i18n/i18n";

describe("i18n", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    if (i18n.isInitialized) {
      await i18n.changeLanguage("ja");
    }
  });

  describe("initI18n", () => {
    it("デフォルト言語が日本語で初期化される", async () => {
      await initI18n();
      expect(i18n.language).toBe("ja");
    });

    it("AsyncStorageに保存された言語で初期化される", async () => {
      await AsyncStorage.setItem(STORAGE_KEY, "en");
      await initI18n();
      expect(i18n.language).toBe("en");
    });

    it("不正な言語が保存されていた場合はデフォルトの日本語で初期化される", async () => {
      await AsyncStorage.setItem(STORAGE_KEY, "fr");
      await initI18n();
      expect(i18n.language).toBe("ja");
    });
  });

  describe("翻訳", () => {
    beforeEach(async () => {
      await initI18n();
    });

    it("日本語の翻訳キーが正しく解決される", () => {
      expect(i18n.t("tabs.pokedex")).toBe("ポケモン図鑑");
      expect(i18n.t("favorites.empty")).toBe("お気に入りのポケモンはまだいません");
    });

    it("英語に切り替えると英語の翻訳が返される", async () => {
      await i18n.changeLanguage("en");
      expect(i18n.t("tabs.pokedex")).toBe("Pokédex");
      expect(i18n.t("favorites.empty")).toBe("No favorite Pokémon yet");
    });

    it("日本語に戻すと日本語の翻訳が返される", async () => {
      await i18n.changeLanguage("en");
      await i18n.changeLanguage("ja");
      expect(i18n.t("tabs.pokedex")).toBe("ポケモン図鑑");
    });
  });

  describe("SUPPORTED_LANGUAGES", () => {
    it("日本語と英語が含まれる", () => {
      expect(SUPPORTED_LANGUAGES).toEqual(["ja", "en"]);
    });
  });
});
