jest.unmock("react-i18next");

import { renderHook, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "@/src/shared/i18n/useLanguage";
import { initI18n, STORAGE_KEY } from "@/src/shared/i18n/i18n";

describe("useLanguage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await initI18n();
  });

  it("現在の言語を返す", () => {
    const { result } = renderHook(() => useLanguage());
    expect(result.current.language).toBe("ja");
  });

  it("言語を変更するとi18nextの言語が更新される", async () => {
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await result.current.changeLanguage("en");
    });

    expect(result.current.language).toBe("en");
  });

  it("言語変更がAsyncStorageに保存される", async () => {
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      await result.current.changeLanguage("en");
    });

    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    expect(saved).toBe("en");
  });
});
