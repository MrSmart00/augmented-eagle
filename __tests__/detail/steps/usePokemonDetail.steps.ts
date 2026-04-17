import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonDetail } from "@/src/detail/hooks/usePokemonDetail";
import { fetchPokemonDetail } from "@/src/detail/repository/pokemonDetailApi";
import type { Pokemon } from "@/src/shared";

jest.mock("@/src/detail/repository/pokemonDetailApi");

const mockFetch = fetchPokemonDetail as jest.MockedFunction<typeof fetchPokemonDetail>;

const feature = loadFeature(
  "__tests__/detail/features/usePokemonDetail.feature"
);

const mockPokemon: Pokemon = {
  id: 25,
  name: "Pikachu",
  types: ["electric"],
  stats: [
    { name: "hp", baseStat: 35 },
    { name: "attack", baseStat: 55 },
    { name: "defense", baseStat: 40 },
    { name: "special-attack", baseStat: 50 },
    { name: "special-defense", baseStat: 50 },
    { name: "speed", baseStat: 90 },
  ],
  height: 4,
  weight: 60,
  abilities: [
    { name: "static", isHidden: false },
    { name: "lightning-rod", isHidden: true },
  ],
};

defineFeature(feature, (test) => {
  let hookResult: ReturnType<typeof renderHook<ReturnType<typeof usePokemonDetail>, { id: number }>>;
  let resolve: (value: Pokemon) => void;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("初期ロード時にisLoadingがtrueになる", ({ given, when, then, and }) => {
    given("fetchPokemonDetailが未解決のPromiseを返す", () => {
      mockFetch.mockReturnValue(new Promise(() => {}));
    });

    when("usePokemonDetailをID25で呼び出す", () => {
      hookResult = renderHook(() => usePokemonDetail(25));
    });

    then("isLoadingがtrueである", () => {
      expect(hookResult.result.current.isLoading).toBe(true);
    });

    and("pokemonがnullである", () => {
      expect(hookResult.result.current.pokemon).toBeNull();
    });
  });

  test("データ取得後にポケモン詳細が設定される", ({ given, when, then, and }) => {
    given("fetchPokemonDetailがピカチュウのデータを返す", () => {
      mockFetch.mockResolvedValueOnce(mockPokemon);
    });

    when("usePokemonDetailをID25で呼び出して完了を待つ", async () => {
      hookResult = renderHook(() => usePokemonDetail(25));
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });
    });

    then("isLoadingがfalseである", () => {
      expect(hookResult.result.current.isLoading).toBe(false);
    });

    and("ポケモン詳細データが設定される", () => {
      expect(hookResult.result.current.pokemon).toEqual(mockPokemon);
    });

    and("fetchPokemonDetailがID25で呼ばれる", () => {
      expect(mockFetch).toHaveBeenCalledWith(25);
    });
  });

  test("エラー時にerror状態が設定される", ({ given, when, then, and }) => {
    given(/^fetchPokemonDetailがエラー「(.*)」を返す$/, (message: string) => {
      mockFetch.mockRejectedValueOnce(new Error(message));
    });

    when("usePokemonDetailをID25で呼び出して完了を待つ", async () => {
      hookResult = renderHook(() => usePokemonDetail(25));
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });
    });

    then("isLoadingがfalseである", () => {
      expect(hookResult.result.current.isLoading).toBe(false);
    });

    and(/^errorが「(.*)」である$/, (message: string) => {
      expect(hookResult.result.current.error).toBe(message);
    });

    and("pokemonがnullである", () => {
      expect(hookResult.result.current.pokemon).toBeNull();
    });
  });

  test("Error以外のエラーでもerror状態が設定される", ({ given, when, then, and }) => {
    given("fetchPokemonDetailが文字列エラーを返す", () => {
      mockFetch.mockRejectedValueOnce("string error");
    });

    when("usePokemonDetailをID25で呼び出して完了を待つ", async () => {
      hookResult = renderHook(() => usePokemonDetail(25));
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });
    });

    then("isLoadingがfalseである", () => {
      expect(hookResult.result.current.isLoading).toBe(false);
    });

    and(/^errorが「(.*)」である$/, (message: string) => {
      expect(hookResult.result.current.error).toBe(message);
    });
  });

  test("アンマウント後にデータ取得が完了しても状態が更新されない", ({ given, when, then, and }) => {
    given("fetchPokemonDetailが遅延Promiseを返す", () => {
      mockFetch.mockReturnValue(new Promise<Pokemon>((r) => { resolve = r; }));
    });

    when("usePokemonDetailをID25で呼び出してアンマウントしてからPromiseを解決する", async () => {
      hookResult = renderHook(() => usePokemonDetail(25));
      expect(hookResult.result.current.isLoading).toBe(true);
      hookResult.unmount();
      await act(async () => { resolve(mockPokemon); });
    });

    then("pokemonがnullである", () => {
      expect(hookResult.result.current.pokemon).toBeNull();
    });

    and("isLoadingがtrueである", () => {
      expect(hookResult.result.current.isLoading).toBe(true);
    });
  });

  test("IDが変わると再取得する", ({ given, when, then }) => {
    given("fetchPokemonDetailがピカチュウのデータを返す", () => {
      mockFetch.mockResolvedValueOnce(mockPokemon);
    });

    when("usePokemonDetailをID25で呼び出して完了後にID1に変更する", async () => {
      hookResult = renderHook(
        (props: { id: number }) => usePokemonDetail(props.id),
        { initialProps: { id: 25 } }
      );
      await waitFor(() => {
        expect(hookResult.result.current.isLoading).toBe(false);
      });

      const newPokemon: Pokemon = {
        ...mockPokemon,
        id: 1,
        name: "Bulbasaur",
        types: ["grass", "poison"],
      };
      mockFetch.mockResolvedValueOnce(newPokemon);
      hookResult.rerender({ id: 1 });

      await waitFor(() => {
        expect(hookResult.result.current.pokemon).toEqual(newPokemon);
      });
    });

    then("新しいポケモンデータが設定される", () => {
      expect(hookResult.result.current.pokemon?.id).toBe(1);
    });
  });
});
