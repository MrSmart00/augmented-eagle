import { renderHook, waitFor } from "@testing-library/react-native";
import { usePokemonById } from "@/src/shared/hooks/usePokemonById";
import { fetchPokemonById } from "@/src/shared/repository/pokemonApi";
import type { Pokemon } from "@/src/shared";

jest.mock("@/src/shared/repository/pokemonApi");

const mockFetch = fetchPokemonById as jest.MockedFunction<typeof fetchPokemonById>;

const mockPokemon: Pokemon = {
  id: 25,
  name: "Pikachu",
  types: ["electric"],
};

describe("usePokemonById", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonById(25));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBeNull();
  });

  it("データ取得後にポケモンが設定される", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon);
    const { result } = renderHook(() => usePokemonById(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toEqual(mockPokemon);
    expect(mockFetch).toHaveBeenCalledWith(25);
  });

  it("エラー時にerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => usePokemonById(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Not found");
    expect(result.current.pokemon).toBeNull();
  });

  it("Error以外のエラーでもerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce("string error");
    const { result } = renderHook(() => usePokemonById(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });

  it("IDが変わると再取得する", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon);
    const { result, rerender } = renderHook(
      (props: { id: number }) => usePokemonById(props.id),
      { initialProps: { id: 25 } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newPokemon: Pokemon = { id: 1, name: "Bulbasaur", types: ["grass", "poison"] };
    mockFetch.mockResolvedValueOnce(newPokemon);
    rerender({ id: 1 });

    await waitFor(() => {
      expect(result.current.pokemon).toEqual(newPokemon);
    });
  });
});
