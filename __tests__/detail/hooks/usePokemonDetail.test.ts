import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonDetail } from "@/src/detail/hooks/usePokemonDetail";
import { fetchPokemonDetail } from "@/src/detail/repository/pokemonDetailApi";
import type { Pokemon } from "@/src/shared";

jest.mock("@/src/detail/repository/pokemonDetailApi");

const mockFetch = fetchPokemonDetail as jest.MockedFunction<typeof fetchPokemonDetail>;

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

describe("usePokemonDetail", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonDetail(25));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBeNull();
  });

  it("データ取得後にポケモン詳細が設定される", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon);
    const { result } = renderHook(() => usePokemonDetail(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toEqual(mockPokemon);
    expect(mockFetch).toHaveBeenCalledWith(25);
  });

  it("エラー時にerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => usePokemonDetail(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Not found");
    expect(result.current.pokemon).toBeNull();
  });

  it("Error以外のエラーでもerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce("string error");
    const { result } = renderHook(() => usePokemonDetail(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });

  it("アンマウント後にデータ取得が完了しても状態が更新されない", async () => {
    let resolve!: (value: Pokemon) => void;
    mockFetch.mockReturnValue(new Promise<Pokemon>((r) => { resolve = r; }));
    const { result, unmount } = renderHook(() => usePokemonDetail(25));

    expect(result.current.isLoading).toBe(true);
    unmount();

    await act(async () => { resolve(mockPokemon); });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("IDが変わると再取得する", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon);
    const { result, rerender } = renderHook(
      (props: { id: number }) => usePokemonDetail(props.id),
      { initialProps: { id: 25 } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newPokemon: Pokemon = {
      ...mockPokemon,
      id: 1,
      name: "Bulbasaur",
      types: ["grass", "poison"],
    };
    mockFetch.mockResolvedValueOnce(newPokemon);
    rerender({ id: 1 });

    await waitFor(() => {
      expect(result.current.pokemon).toEqual(newPokemon);
    });
  });
});
