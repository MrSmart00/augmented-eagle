import { renderHook, waitFor, act } from "@testing-library/react-native";
import { fetchPokemonFlavorText } from "@/src/detail/repository/pokemonSpeciesApi";
import { usePokemonFlavorText } from "@/src/detail/hooks/usePokemonFlavorText";

jest.mock("@/src/detail/repository/pokemonSpeciesApi");

const mockFetchFlavorText = fetchPokemonFlavorText as jest.MockedFunction<typeof fetchPokemonFlavorText>;

describe("usePokemonFlavorText", () => {
  beforeEach(() => {
    mockFetchFlavorText.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetchFlavorText.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonFlavorText(25));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.flavorText).toBeNull();
  });

  it("データ取得後にフレーバーテキストが設定される", async () => {
    mockFetchFlavorText.mockResolvedValueOnce("でんきを　ためこむ　せいしつ。");
    const { result } = renderHook(() => usePokemonFlavorText(25));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.flavorText).toBe("でんきを　ためこむ　せいしつ。");
  });

  it("エラー時はflavorTextがnullのままになる", async () => {
    mockFetchFlavorText.mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => usePokemonFlavorText(25));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.flavorText).toBeNull();
  });

  it("アンマウント後にデータ取得が完了しても状態が更新されない", async () => {
    let resolve: (value: string | null) => void;
    mockFetchFlavorText.mockReturnValue(new Promise<string | null>((r) => { resolve = r; }));
    const { result, unmount } = renderHook(() => usePokemonFlavorText(25));
    expect(result.current.isLoading).toBe(true);
    unmount();
    await act(async () => { resolve!("テスト"); });
    expect(result.current.flavorText).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });
});
