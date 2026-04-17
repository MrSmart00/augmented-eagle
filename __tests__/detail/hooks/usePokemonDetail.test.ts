import { renderHook, waitFor, act } from "@testing-library/react-native";
import { fetchPokemonDetail } from "@/src/detail/repository/pokemonDetailApi";
import { usePokemonDetail } from "@/src/detail/hooks/usePokemonDetail";
import type { Pokemon } from "@/src/shared";

jest.mock("@/src/detail/repository/pokemonDetailApi");

const mockFetchDetail = fetchPokemonDetail as jest.MockedFunction<typeof fetchPokemonDetail>;

const mockScreenPokemon: Pokemon = {
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

describe("usePokemonDetail", () => {
  beforeEach(() => {
    mockFetchDetail.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetchDetail.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonDetail(25));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBeNull();
  });

  it("データ取得後にポケモン詳細が設定される", async () => {
    mockFetchDetail.mockResolvedValueOnce(mockScreenPokemon);
    const { result } = renderHook(() => usePokemonDetail(25));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toEqual(mockScreenPokemon);
    expect(mockFetchDetail).toHaveBeenCalledWith(25);
  });

  it("エラー時にerror状態が設定される", async () => {
    mockFetchDetail.mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => usePokemonDetail(25));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Not found");
    expect(result.current.pokemon).toBeNull();
  });

  it("Error以外のエラーでもerror状態が設定される", async () => {
    mockFetchDetail.mockRejectedValueOnce("string error");
    const { result } = renderHook(() => usePokemonDetail(25));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Unknown error");
  });

  it("アンマウント後にデータ取得が完了しても状態が更新されない", async () => {
    let resolve: (value: Pokemon) => void;
    mockFetchDetail.mockReturnValue(new Promise<Pokemon>((r) => { resolve = r; }));
    const { result, unmount } = renderHook(() => usePokemonDetail(25));
    expect(result.current.isLoading).toBe(true);
    unmount();
    await act(async () => { resolve!(mockScreenPokemon); });
    expect(result.current.pokemon).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("IDが変わると再取得する", async () => {
    mockFetchDetail.mockResolvedValueOnce(mockScreenPokemon);
    const { result, rerender } = renderHook(
      (props: { id: number }) => usePokemonDetail(props.id),
      { initialProps: { id: 25 } }
    );
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newPokemon: Pokemon = {
      ...mockScreenPokemon,
      id: 1,
      name: "Bulbasaur",
      types: ["grass", "poison"],
    };
    mockFetchDetail.mockResolvedValueOnce(newPokemon);
    rerender({ id: 1 });

    await waitFor(() => {
      expect(result.current.pokemon).toEqual(newPokemon);
    });
    expect(result.current.pokemon?.id).toBe(1);
  });
});
