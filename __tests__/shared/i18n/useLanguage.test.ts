jest.unmock("react-i18next");

import { renderHook, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { initI18n, STORAGE_KEY } from "@/src/shared/i18n/i18n";
import { useLanguage } from "@/src/shared/i18n/useLanguage";
import type { SupportedLanguage } from "@/src/shared";

describe("useLanguage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    if (i18n.isInitialized) {
      await i18n.changeLanguage("ja");
    }
  });

  it("現在の言語を返す", async () => {
    await initI18n();
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe("ja");
  });

  it("言語を変更するとi18nextの言語が更新される", async () => {
    await initI18n();
    const { result } = renderHook(() => useLanguage());
    await act(async () => {
      await result.current.changeLanguage("en" as SupportedLanguage);
    });
    expect(result.current.language).toBe("en");
  });

  it("言語変更がAsyncStorageに保存される", async () => {
    await initI18n();
    const { result } = renderHook(() => useLanguage());
    await act(async () => {
      await result.current.changeLanguage("en" as SupportedLanguage);
    });
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    expect(saved).toBe("en");
  });
});
