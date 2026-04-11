import { renderHook, waitFor, act } from "@testing-library/react-native";
import { usePokemonSpeciesInfo } from "@/src/modules/detail/hooks/usePokemonSpeciesInfo";
import { fetchPokemonSpeciesInfo } from "@/src/modules/detail/repository/pokemonSpeciesApi";

jest.mock("@/src/modules/detail/repository/pokemonSpeciesApi");

const mockFetch = fetchPokemonSpeciesInfo as jest.MockedFunction<typeof fetchPokemonSpeciesInfo>;

describe("usePokemonSpeciesInfo", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonSpeciesInfo(25));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.localizedName).toBeNull();
    expect(result.current.flavorText).toBeNull();
  });

  it("ローカライズされたポケモン名とフレーバーテキストを返す", async () => {
    mockFetch.mockResolvedValueOnce({
      localizedName: "ピカチュウ",
      flavorText: "でんきを　ためこむ　せいしつ。",
    });
    const { result } = renderHook(() => usePokemonSpeciesInfo(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.localizedName).toBe("ピカチュウ");
    expect(result.current.flavorText).toBe("でんきを　ためこむ　せいしつ。");
    expect(mockFetch).toHaveBeenCalledWith(25, "ja");
  });

  it("エラー時にnullを返す", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => usePokemonSpeciesInfo(25));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.localizedName).toBeNull();
    expect(result.current.flavorText).toBeNull();
  });

  it("アンマウント後にデータ取得が完了しても状態が更新されない", async () => {
    let resolve!: (value: { localizedName: string | null; flavorText: string | null }) => void;
    mockFetch.mockReturnValue(new Promise((r) => { resolve = r; }));
    const { result, unmount } = renderHook(() => usePokemonSpeciesInfo(25));

    expect(result.current.isLoading).toBe(true);
    unmount();

    await act(async () => { resolve({ localizedName: "ピカチュウ", flavorText: "テスト" }); });

    expect(result.current.localizedName).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });
});
