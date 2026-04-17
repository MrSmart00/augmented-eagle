import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonSpeciesInfo } from "@/src/detail/hooks/usePokemonSpeciesInfo";
import { fetchPokemonSpeciesInfo } from "@/src/detail/repository/pokemonSpeciesApi";

jest.mock("@/src/detail/repository/pokemonSpeciesApi");

const mockFetch = fetchPokemonSpeciesInfo as jest.MockedFunction<typeof fetchPokemonSpeciesInfo>;

const feature = loadFeature(
  "__tests__/detail/features/usePokemonSpeciesInfo.feature"
);

defineFeature(feature, (test) => {
  let hookResult: ReturnType<typeof renderHook<ReturnType<typeof usePokemonSpeciesInfo>, unknown>>;
  let resolve: (value: { localizedName: string | null; flavorText: string | null }) => void;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("初期ロード時にisLoadingがtrueになる", ({ given, when, then, and }) => {
    given("fetchPokemonSpeciesInfoが未解決のPromiseを返す", () => {
      mockFetch.mockReturnValue(new Promise(() => {}));
    });

    when("usePokemonSpeciesInfoをID25で呼び出す", () => {
      hookResult = renderHook(() => usePokemonSpeciesInfo(25));
    });

    then("isLoadingがtrueである", () => {
      expect(hookResult.result.current.isLoading).toBe(true);
    });

    and("localizedNameがnullである", () => {
      expect(hookResult.result.current.localizedName).toBeNull();
    });

    and("flavorTextがnullである", () => {
      expect(hookResult.result.current.flavorText).toBeNull();
    });
  });

  test("ローカライズされたポケモン名とフレーバーテキストを返す", ({ given, when, then, and }) => {
    given("fetchPokemonSpeciesInfoが日本語データを返す", () => {
      mockFetch.mockResolvedValueOnce({
        localizedName: "ピカチュウ",
        flavorText: "でんきを　ためこむ　せいしつ。",
      });
    });

    when("usePokemonSpeciesInfoをID25で呼び出して完了を待つ", async () => {
      hookResult = renderHook(() => usePokemonSpeciesInfo(25));
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });
    });

    then("isLoadingがfalseである", () => {
      expect(hookResult.result.current.isLoading).toBe(false);
    });

    and(/^localizedNameが「(.*)」である$/, (name: string) => {
      expect(hookResult.result.current.localizedName).toBe(name);
    });

    and(/^flavorTextが「(.*)」である$/, (text: string) => {
      expect(hookResult.result.current.flavorText).toBe(text);
    });

    and(/^fetchPokemonSpeciesInfoがID(\d+)と言語「(.*)」で呼ばれる$/, (id: string, lang: string) => {
      expect(mockFetch).toHaveBeenCalledWith(Number(id), lang);
    });
  });

  test("エラー時にnullを返す", ({ given, when, then, and }) => {
    given("fetchPokemonSpeciesInfoがエラーを返す", () => {
      mockFetch.mockRejectedValueOnce(new Error("Not found"));
    });

    when("usePokemonSpeciesInfoをID25で呼び出して完了を待つ", async () => {
      hookResult = renderHook(() => usePokemonSpeciesInfo(25));
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });
    });

    then("isLoadingがfalseである", () => {
      expect(hookResult.result.current.isLoading).toBe(false);
    });

    and("localizedNameがnullである", () => {
      expect(hookResult.result.current.localizedName).toBeNull();
    });

    and("flavorTextがnullである", () => {
      expect(hookResult.result.current.flavorText).toBeNull();
    });
  });

  test("アンマウント後にデータ取得が完了しても状態が更新されない", ({ given, when, then, and }) => {
    given("fetchPokemonSpeciesInfoが遅延Promiseを返す", () => {
      mockFetch.mockReturnValue(new Promise((r) => { resolve = r; }));
    });

    when("usePokemonSpeciesInfoをID25で呼び出してアンマウントしてからPromiseを解決する", async () => {
      hookResult = renderHook(() => usePokemonSpeciesInfo(25));
      expect(hookResult.result.current.isLoading).toBe(true);
      hookResult.unmount();
      await act(async () => { resolve({ localizedName: "ピカチュウ", flavorText: "テスト" }); });
    });

    then("localizedNameがnullである", () => {
      expect(hookResult.result.current.localizedName).toBeNull();
    });

    and("isLoadingがtrueである", () => {
      expect(hookResult.result.current.isLoading).toBe(true);
    });
  });
});
