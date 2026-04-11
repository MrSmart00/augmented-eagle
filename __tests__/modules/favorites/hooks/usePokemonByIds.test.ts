import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonByIds } from "@/src/modules/favorites/hooks/usePokemonByIds";
import { fetchPokemonById } from "@/src/shared/repository/pokemonApi";
import type { PokemonSummary } from "@/src/shared";

jest.mock("@/src/shared/repository/pokemonApi");

const mockFetch = fetchPokemonById as jest.MockedFunction<typeof fetchPokemonById>;

const mockPokemon: PokemonSummary[] = [
  { id: 25, name: "Pikachu", types: ["electric"] },
  { id: 1, name: "Bulbasaur", types: ["grass", "poison"] },
];

describe("usePokemonByIds", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("空配列の場合はローディングせず空配列を返す", () => {
    const { result } = renderHook(() => usePokemonByIds([]));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toEqual([]);
  });

  it("複数IDのポケモンを並列取得する", async () => {
    mockFetch
      .mockResolvedValueOnce(mockPokemon[0])
      .mockResolvedValueOnce(mockPokemon[1]);

    const { result } = renderHook(() => usePokemonByIds([25, 1]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("一部取得に失敗してもエラーが設定される", async () => {
    mockFetch
      .mockResolvedValueOnce(mockPokemon[0])
      .mockRejectedValueOnce(new Error("Not found"));

    const { result } = renderHook(() => usePokemonByIds([25, 999]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Not found");
  });

  it("Error以外のエラーでもerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => usePokemonByIds([25]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });

  it("アンマウント後にデータ取得が完了しても状態が更新されない", async () => {
    let resolve!: (value: PokemonSummary) => void;
    mockFetch.mockReturnValue(new Promise<PokemonSummary>((r) => { resolve = r; }));
    const { result, unmount } = renderHook(() => usePokemonByIds([25]));

    expect(result.current.isLoading).toBe(true);
    unmount();

    await act(async () => { resolve(mockPokemon[0]); });

    expect(result.current.pokemon).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("IDリストが変わると再取得する", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon[0]);

    const { result, rerender } = renderHook(
      (props: { ids: number[] }) => usePokemonByIds(props.ids),
      { initialProps: { ids: [25] } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(1);

    mockFetch
      .mockResolvedValueOnce(mockPokemon[0])
      .mockResolvedValueOnce(mockPokemon[1]);

    rerender({ ids: [25, 1] });

    await waitFor(() => {
      expect(result.current.pokemon).toHaveLength(2);
    });
  });
});
