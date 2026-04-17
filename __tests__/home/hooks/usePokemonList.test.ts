import { renderHook, act, waitFor } from "@testing-library/react-native";
import { usePokemonList } from "@/src/home";
import { fetchPokemonListGraphQL } from "@/src/home/repository/pokemonGraphqlApi";
import type { PokemonListResult } from "@/src/home/repository/pokemonGraphqlApi";

jest.mock("@/src/home/repository/pokemonGraphqlApi");

const mockFetchGraphQL = fetchPokemonListGraphQL as jest.MockedFunction<
  typeof fetchPokemonListGraphQL
>;

const makePage = (
  offset: number,
  totalCount: number
): PokemonListResult => ({
  count: totalCount,
  pokemon: [
    { id: offset + 1, name: `ポケモン${offset + 1}`, types: ["grass"] },
    { id: offset + 2, name: `ポケモン${offset + 2}`, types: ["fire"] },
  ],
});

describe("usePokemonList", () => {
  beforeEach(() => {
    mockFetchGraphQL.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetchGraphQL.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonList());

    expect(result.current.isLoading).toBe(true);
  });

  it("データ取得後にポケモン一覧が設定される", async () => {
    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 40));

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
    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 40));

    renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(mockFetchGraphQL).toHaveBeenCalled();
    });

    expect(mockFetchGraphQL).toHaveBeenCalledWith(20, 0, "ja");
  });

  it("loadMoreで追加データが追加される", async () => {
    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 40));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetchGraphQL.mockResolvedValueOnce(makePage(20, 40));

    await act(async () => {
      result.current.loadMore();
    });
    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(4);
  });

  it("総件数に達した場合hasMoreがfalseになる", async () => {
    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 2));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("hasMoreがfalseの場合loadMoreは何もしない", async () => {
    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 2));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.loadMore();
    });

    expect(mockFetchGraphQL).toHaveBeenCalledTimes(1);
  });

  it("refreshでデータがリセットされる", async () => {
    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 40));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 40));

    await act(async () => {
      result.current.refresh();
    });
    await waitFor(() => {
      expect(result.current.isRefreshing).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(2);
    expect(mockFetchGraphQL).toHaveBeenCalledTimes(2);
    expect(mockFetchGraphQL).toHaveBeenLastCalledWith(20, 0, "ja");
  });

  it("エラー時にerror状態が設定される", async () => {
    mockFetchGraphQL.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
  });

  it("初期ロードでError以外のエラーでもerror状態が設定される", async () => {
    mockFetchGraphQL.mockRejectedValueOnce("string error");

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });

  it("loadMoreでError以外のエラーでもerror状態が設定される", async () => {
    mockFetchGraphQL.mockResolvedValueOnce(makePage(0, 40));

    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetchGraphQL.mockRejectedValueOnce("string error");

    await act(async () => {
      result.current.loadMore();
    });
    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.error).toBe("Unknown error");
  });
});
