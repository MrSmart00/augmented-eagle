import { renderHook, waitFor, act } from "@testing-library/react-native";
import { fetchPokemonSpeciesInfo } from "@/src/detail/repository/pokemonSpeciesApi";
import { usePokemonSpeciesInfo } from "@/src/detail/hooks/usePokemonSpeciesInfo";

jest.mock("@/src/detail/repository/pokemonSpeciesApi");

const mockFetchSpeciesInfo = fetchPokemonSpeciesInfo as jest.MockedFunction<typeof fetchPokemonSpeciesInfo>;

describe("usePokemonSpeciesInfo", () => {
  beforeEach(() => {
    mockFetchSpeciesInfo.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetchSpeciesInfo.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonSpeciesInfo(25));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.localizedName).toBeNull();
    expect(result.current.flavorText).toBeNull();
  });

  it("ローカライズされたポケモン名とフレーバーテキストを返す", async () => {
    mockFetchSpeciesInfo.mockResolvedValueOnce({
      localizedName: "ピカチュウ",
      flavorText: "でんきを　ためこむ　せいしつ。",
    });
    const { result } = renderHook(() => usePokemonSpeciesInfo(25));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.localizedName).toBe("ピカチュウ");
    expect(result.current.flavorText).toBe("でんきを　ためこむ　せいしつ。");
    expect(mockFetchSpeciesInfo).toHaveBeenCalledWith(25, "ja");
  });

  it("エラー時にnullを返す", async () => {
    mockFetchSpeciesInfo.mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => usePokemonSpeciesInfo(25));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.localizedName).toBeNull();
    expect(result.current.flavorText).toBeNull();
  });

  it("アンマウント後にデータ取得が完了しても状態が更新されない", async () => {
    let resolve: (value: { localizedName: string | null; flavorText: string | null }) => void;
    mockFetchSpeciesInfo.mockReturnValue(new Promise((r) => { resolve = r; }));
    const { result, unmount } = renderHook(() => usePokemonSpeciesInfo(25));
    expect(result.current.isLoading).toBe(true);
    unmount();
    await act(async () => { resolve!({ localizedName: "ピカチュウ", flavorText: "テスト" }); });
    expect(result.current.localizedName).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });
});
