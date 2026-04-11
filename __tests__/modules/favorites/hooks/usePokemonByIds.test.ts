import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonByIds } from "@/src/modules/favorites/hooks/usePokemonByIds";
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

describe("usePokemonByIds", () => {
  beforeEach(() => {
    mockFetchById.mockReset();
    mockFetchSpecies.mockReset();
  });

  it("空配列の場合はローディングせず空配列を返す", () => {
    const { result } = renderHook(() => usePokemonByIds([]));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toEqual([]);
  });

  it("複数IDのポケモンを並列取得する", async () => {
    mockFetchById
      .mockResolvedValueOnce(mockPokemon[0])
      .mockResolvedValueOnce(mockPokemon[1]);
    mockFetchSpecies
      .mockResolvedValueOnce(mockSpeciesJa[0])
      .mockResolvedValueOnce(mockSpeciesJa[1]);

    const { result } = renderHook(() => usePokemonByIds([25, 1]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(2);
    expect(mockFetchById).toHaveBeenCalledTimes(2);
    expect(mockFetchSpecies).toHaveBeenCalledTimes(2);
  });

  it("ローカライズ名がある場合はローカライズ名を使用する", async () => {
    mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
    mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);

    const { result } = renderHook(() => usePokemonByIds([25]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon[0].name).toBe("ピカチュウ");
  });

  it("ローカライズ名がnullの場合は英語名にフォールバックする", async () => {
    mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
    mockFetchSpecies.mockResolvedValueOnce({ localizedName: null, flavorText: null });

    const { result } = renderHook(() => usePokemonByIds([25]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon[0].name).toBe("Pikachu");
  });

  it("現在の言語をfetchPokemonSpeciesInfoに渡す", async () => {
    mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
    mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);

    const { result } = renderHook(() => usePokemonByIds([25]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchSpecies).toHaveBeenCalledWith(25, "ja");
  });

  it("一部取得に失敗してもエラーが設定される", async () => {
    mockFetchById
      .mockResolvedValueOnce(mockPokemon[0])
      .mockRejectedValueOnce(new Error("Not found"));
    mockFetchSpecies
      .mockResolvedValueOnce(mockSpeciesJa[0])
      .mockResolvedValueOnce(mockSpeciesJa[1]);

    const { result } = renderHook(() => usePokemonByIds([25, 999]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Not found");
  });

  it("Error以外のエラーでもerror状態が設定される", async () => {
    mockFetchById.mockRejectedValueOnce("string error");
    mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);

    const { result } = renderHook(() => usePokemonByIds([25]));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });

  it("アンマウント後にデータ取得が完了しても状態が更新されない", async () => {
    let resolve!: (value: PokemonSummary) => void;
    mockFetchById.mockReturnValue(new Promise<PokemonSummary>((r) => { resolve = r; }));
    mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);
    const { result, unmount } = renderHook(() => usePokemonByIds([25]));

    expect(result.current.isLoading).toBe(true);
    unmount();

    await act(async () => { resolve(mockPokemon[0]); });

    expect(result.current.pokemon).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it("IDリストが変わると再取得する", async () => {
    mockFetchById.mockResolvedValueOnce(mockPokemon[0]);
    mockFetchSpecies.mockResolvedValueOnce(mockSpeciesJa[0]);

    const { result, rerender } = renderHook(
      (props: { ids: number[] }) => usePokemonByIds(props.ids),
      { initialProps: { ids: [25] } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(1);

    mockFetchById
      .mockResolvedValueOnce(mockPokemon[0])
      .mockResolvedValueOnce(mockPokemon[1]);
    mockFetchSpecies
      .mockResolvedValueOnce(mockSpeciesJa[0])
      .mockResolvedValueOnce(mockSpeciesJa[1]);

    rerender({ ids: [25, 1] });

    await waitFor(() => {
      expect(result.current.pokemon).toHaveLength(2);
    });
  });
});
