import { renderHook, act, waitFor } from "@testing-library/react-native";
import { usePokemonList } from "@/src/modules/home/hooks/usePokemonList";
import { fetchPokemonListGraphQL } from "@/src/modules/home/repository/pokemonGraphqlApi";
import type { PokemonListResult } from "@/src/modules/home/repository/pokemonGraphqlApi";

jest.mock("@/src/modules/home/repository/pokemonGraphqlApi");

const mockFetch = fetchPokemonListGraphQL as jest.MockedFunction<
  typeof fetchPokemonListGraphQL
>;

const makePage = (
  offset: number,
  totalCount: number,
): PokemonListResult => ({
  count: totalCount,
  pokemon: [
    { id: offset + 1, name: `ポケモン${offset + 1}`, types: ["grass"] },
    { id: offset + 2, name: `ポケモン${offset + 2}`, types: ["fire"] },
  ],
});

describe("usePokemonList", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePokemonList());

    expect(result.current.isLoading).toBe(true);
  });

  it("データ取得後にポケモン一覧が設定される", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, 40));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(2);
    expect(result.current.pokemon[0].name).toBe("ポケモン1");
    expect(result.current.pokemon[0].id).toBe(1);
    expect(result.current.pokemon[0].types).toEqual(["grass"]);
  });

  it("言語パラメータがGraphQL関数に渡される", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, 40));
    renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(20, 0, "ja");
    });
  });

  it("loadMoreで追加データが追加される", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, 40));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetch.mockResolvedValueOnce(makePage(20, 40));
    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(4);
  });

  it("総件数に達した場合hasMoreがfalseになる", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, 2));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("hasMoreがfalseの場合loadMoreは何もしない", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, 2));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.loadMore();
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("refreshでデータがリセットされる", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, 40));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetch.mockResolvedValueOnce(makePage(0, 40));
    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.isRefreshing).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenLastCalledWith(20, 0, "ja");
  });

  it("エラー時にerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
  });

  it("初期ロードでError以外のエラーでもerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce("string error");
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });

  it("loadMoreでError以外のエラーでもerror状態が設定される", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, 40));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetch.mockRejectedValueOnce("string error");
    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });
});
