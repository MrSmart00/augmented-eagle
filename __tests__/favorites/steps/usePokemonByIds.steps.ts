import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonByIds } from "@/src/favorites/hooks/usePokemonByIds";
import { fetchPokemonById } from "@/src/shared/repository/pokemonApi";
import { fetchPokemonSpeciesInfo } from "@/src/shared/repository/pokemonSpeciesApi";
import type { PokemonSummary, PokemonSpeciesInfo } from "@/src/shared";

jest.mock("@/src/shared/repository/pokemonApi");
jest.mock("@/src/shared/repository/pokemonSpeciesApi");

const mockFetchById = fetchPokemonById as jest.MockedFunction<typeof fetchPokemonById>;
const mockFetchSpecies = fetchPokemonSpeciesInfo as jest.MockedFunction<typeof fetchPokemonSpeciesInfo>;

const mockPokemon: PokemonSummary[] = [
  { id: 25, name: "Pikachu", types: ["electric"] },
  { id: 1, name: "Bulbasaur", types: ["grass", "poison"] },
];

const mockSpeciesJa: PokemonSpeciesInfo[] = [
  { localizedName: "ピカチュウ", flavorText: null },
  { localizedName: "フシギダネ", flavorText: null },
];

const feature = loadFeature(
  "__tests__/favorites/features/usePokemonByIds.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    mockFetchById.mockReset();
    mockFetchSpecies.mockReset();
  });

  test("空配列の場合はローディングせず空配列を返す", ({ given, when, then, and }) => {
    let result: ReturnType<typeof usePokemonByIds>;

    given("IDリストが空配列である", () => {
      // no setup needed
    });

    when("フックをレンダーする", () => {
      const hook = renderHook(() => usePokemonByIds([]));
      result = hook.result.current;
    });

    then("isLoadingはfalseである", () => {
      expect(result.isLoading).toBe(false);
    });

    and("pokemonは空配列である", () => {
      expect(result.pokemon).toEqual([]);
    });
  });

  test("複数IDのポケモンを並列取得する", ({ given, when, then, and }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };

    given(/^ID 25 と 1 のポケモンデータが存在する$/, () => {
      mockFetchById
        .mockResolvedValueOnce(mockPokemon[0])
        .mockResolvedValueOnce(mockPokemon[1]);
      mockFetchSpecies
        .mockResolvedValueOnce(mockSpeciesJa[0])
        .mockResolvedValueOnce(mockSpeciesJa[1]);
    });

    when(/^IDリスト \[25, 1\] でフックをレンダーする$/, () => {
      const hook = renderHook(() => usePokemonByIds([25, 1]));
      hookResult = hook.result;
    });

    then("ローディング完了後にポケモンが2件取得される", async () => {
      await waitFor(() => {
        expect(hookResult.current.isLoading).toBe(false);
      });
      expect(hookResult.current.pokemon).toHaveLength(2);
    });

    and("fetchPokemonByIdが2回呼ばれる", () => {
      expect(mockFetchById).toHaveBeenCalledTimes(2);
    });

    and("fetchPokemonSpeciesInfoが2回呼ばれる", () => {
      expect(mockFetchSpecies).toHaveBeenCalledTimes(2);
    });
  });

  test("ローカライズ名がある場合はローカライズ名を使用する", ({ given, when, then }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };

    given(/^ID 25 のポケモンにローカライズ名 "ピカチュウ" が存在する$/, () => {
      mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
      mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);
    });

    when(/^IDリスト \[25\] でフックをレンダーする$/, () => {
      const hook = renderHook(() => usePokemonByIds([25]));
      hookResult = hook.result;
    });

    then(/^ポケモンの名前は "ピカチュウ" である$/, async () => {
      await waitFor(() => {
        expect(hookResult.current.isLoading).toBe(false);
      });
      expect(hookResult.current.pokemon[0].name).toBe("ピカチュウ");
    });
  });

  test("ローカライズ名がnullの場合は英語名にフォールバックする", ({ given, when, then }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };

    given(/^ID 25 のポケモンにローカライズ名がnullである$/, () => {
      mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
      mockFetchSpecies.mockResolvedValueOnce({ localizedName: null, flavorText: null });
    });

    when(/^IDリスト \[25\] でフックをレンダーする$/, () => {
      const hook = renderHook(() => usePokemonByIds([25]));
      hookResult = hook.result;
    });

    then(/^ポケモンの名前は "Pikachu" である$/, async () => {
      await waitFor(() => {
        expect(hookResult.current.isLoading).toBe(false);
      });
      expect(hookResult.current.pokemon[0].name).toBe("Pikachu");
    });
  });

  test("現在の言語をfetchPokemonSpeciesInfoに渡す", ({ given, when, then }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };

    given(/^ID 25 のポケモンデータが存在する$/, () => {
      mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
      mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);
    });

    when(/^IDリスト \[25\] でフックをレンダーする$/, () => {
      const hook = renderHook(() => usePokemonByIds([25]));
      hookResult = hook.result;
    });

    then(/^fetchPokemonSpeciesInfoにID 25 と言語 "ja" が渡される$/, async () => {
      await waitFor(() => {
        expect(hookResult.current.isLoading).toBe(false);
      });
      expect(mockFetchSpecies).toHaveBeenCalledWith(25, "ja");
    });
  });

  test("一部取得に失敗してもエラーが設定される", ({ given, when, then }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };

    given(/^ID 25 のポケモンは取得成功しID 999 は取得失敗する$/, () => {
      mockFetchById
        .mockResolvedValueOnce(mockPokemon[0])
        .mockRejectedValueOnce(new Error("Not found"));
      mockFetchSpecies
        .mockResolvedValueOnce(mockSpeciesJa[0])
        .mockResolvedValueOnce(mockSpeciesJa[1]);
    });

    when(/^IDリスト \[25, 999\] でフックをレンダーする$/, () => {
      const hook = renderHook(() => usePokemonByIds([25, 999]));
      hookResult = hook.result;
    });

    then(/^エラーメッセージは "Not found" である$/, async () => {
      await waitFor(() => {
        expect(hookResult.current.isLoading).toBe(false);
      });
      expect(hookResult.current.error).toBe("Not found");
    });
  });

  test("Error以外のエラーでもerror状態が設定される", ({ given, when, then }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };

    given(/^ID 25 のポケモン取得が文字列エラーで失敗する$/, () => {
      mockFetchById.mockRejectedValueOnce("string error");
      mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);
    });

    when(/^IDリスト \[25\] でフックをレンダーする$/, () => {
      const hook = renderHook(() => usePokemonByIds([25]));
      hookResult = hook.result;
    });

    then(/^エラーメッセージは "Unknown error" である$/, async () => {
      await waitFor(() => {
        expect(hookResult.current.isLoading).toBe(false);
      });
      expect(hookResult.current.error).toBe("Unknown error");
    });
  });

  test("アンマウント後にデータ取得が完了しても状態が更新されない", ({ given, when, then, and }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };
    let resolve!: (value: PokemonSummary) => void;

    given(/^ID 25 のポケモン取得が未解決のPromiseを返す$/, () => {
      mockFetchById.mockReturnValue(new Promise<PokemonSummary>((r) => { resolve = r; }));
      mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);
    });

    when(/^IDリスト \[25\] でフックをレンダーしてアンマウントする$/, async () => {
      const { result, unmount } = renderHook(() => usePokemonByIds([25]));
      hookResult = result;
      expect(hookResult.current.isLoading).toBe(true);
      unmount();
      await act(async () => { resolve(mockPokemon[0]); });
    });

    then("pokemonは空配列のままである", () => {
      expect(hookResult.current.pokemon).toEqual([]);
    });

    and("isLoadingはtrueのままである", () => {
      expect(hookResult.current.isLoading).toBe(true);
    });
  });

  test("IDリストが変わると再取得する", ({ given, when, then }) => {
    let hookResult: { current: ReturnType<typeof usePokemonByIds> };
    let rerender: (props: { ids: number[] }) => void;

    given(/^ID 25 と 1 のポケモンデータが存在する$/, () => {
      mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
      mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);
    });

    when(/^IDリスト \[25\] でフックをレンダーし、その後 \[25, 1\] に変更する$/, async () => {
      const hook = renderHook(
        (props: { ids: number[] }) => usePokemonByIds(props.ids),
        { initialProps: { ids: [25] } }
      );
      hookResult = hook.result;
      rerender = hook.rerender;

      await waitFor(() => {
        expect(hookResult.current.isLoading).toBe(false);
      });
      expect(hookResult.current.pokemon).toHaveLength(1);

      mockFetchById
        .mockResolvedValueOnce(mockPokemon[0])
        .mockResolvedValueOnce(mockPokemon[1]);
      mockFetchSpecies
        .mockResolvedValueOnce(mockSpeciesJa[0])
        .mockResolvedValueOnce(mockSpeciesJa[1]);

      rerender({ ids: [25, 1] });
    });

    then("ポケモンが2件取得される", async () => {
      await waitFor(() => {
        expect(hookResult.current.pokemon).toHaveLength(2);
      });
    });
  });
});
