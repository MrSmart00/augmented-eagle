import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonFlavorText } from "@/src/detail/hooks/usePokemonFlavorText";
import { fetchPokemonFlavorText } from "@/src/detail/repository/pokemonSpeciesApi";

jest.mock("@/src/detail/repository/pokemonSpeciesApi");

const mockFetch = fetchPokemonFlavorText as jest.MockedFunction<typeof fetchPokemonFlavorText>;

const feature = loadFeature(
  "__tests__/detail/features/usePokemonFlavorText.feature"
);

defineFeature(feature, (test) => {
  let hookResult: ReturnType<typeof renderHook<ReturnType<typeof usePokemonFlavorText>, unknown>>;
  let resolve: (value: string | null) => void;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("初期ロード時にisLoadingがtrueになる", ({ given, when, then, and }) => {
    given("fetchPokemonFlavorTextが未解決のPromiseを返す", () => {
      mockFetch.mockReturnValue(new Promise(() => {}));
    });

    when("usePokemonFlavorTextをID25で呼び出す", () => {
      hookResult = renderHook(() => usePokemonFlavorText(25));
    });

    then("isLoadingがtrueである", () => {
      expect(hookResult.result.current.isLoading).toBe(true);
    });

    and("flavorTextがnullである", () => {
      expect(hookResult.result.current.flavorText).toBeNull();
    });
  });

  test("データ取得後にフレーバーテキストが設定される", ({ given, when, then, and }) => {
    given("fetchPokemonFlavorTextがテキストを返す", () => {
      mockFetch.mockResolvedValueOnce("でんきを　ためこむ　せいしつ。");
    });

    when("usePokemonFlavorTextをID25で呼び出して完了を待つ", async () => {
      hookResult = renderHook(() => usePokemonFlavorText(25));
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });
    });

    then("isLoadingがfalseである", () => {
      expect(hookResult.result.current.isLoading).toBe(false);
    });

    and(/^flavorTextが「(.*)」である$/, (text: string) => {
      expect(hookResult.result.current.flavorText).toBe(text);
    });
  });

  test("エラー時はflavorTextがnullのままになる", ({ given, when, then, and }) => {
    given("fetchPokemonFlavorTextがエラーを返す", () => {
      mockFetch.mockRejectedValueOnce(new Error("Not found"));
    });

    when("usePokemonFlavorTextをID25で呼び出して完了を待つ", async () => {
      hookResult = renderHook(() => usePokemonFlavorText(25));
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });
    });

    then("isLoadingがfalseである", () => {
      expect(hookResult.result.current.isLoading).toBe(false);
    });

    and("flavorTextがnullである", () => {
      expect(hookResult.result.current.flavorText).toBeNull();
    });
  });

  test("アンマウント後にデータ取得が完了しても状態が更新されない", ({ given, when, then, and }) => {
    given("fetchPokemonFlavorTextが遅延Promiseを返す", () => {
      mockFetch.mockReturnValue(new Promise<string | null>((r) => { resolve = r; }));
    });

    when("usePokemonFlavorTextをID25で呼び出してアンマウントしてからPromiseを解決する", async () => {
      hookResult = renderHook(() => usePokemonFlavorText(25));
      expect(hookResult.result.current.isLoading).toBe(true);
      hookResult.unmount();
      await act(async () => { resolve("テスト"); });
    });

    then("flavorTextがnullである", () => {
      expect(hookResult.result.current.flavorText).toBeNull();
    });

    and("isLoadingがtrueである", () => {
      expect(hookResult.result.current.isLoading).toBe(true);
    });
  });
});
