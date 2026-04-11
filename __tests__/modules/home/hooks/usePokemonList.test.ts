import { renderHook, act, waitFor } from "@testing-library/react-native";
import { usePokemonList } from "@/src/modules/home/hooks/usePokemonList";
import { fetchPokemonList } from "@/src/modules/home/repository/pokemonApi";
import type { PokeApiListResponse } from "@/src/modules/home/domain/pokemonListItem";

jest.mock("@/src/modules/home/repository/pokemonApi");

const mockFetch = fetchPokemonList as jest.MockedFunction<
  typeof fetchPokemonList
>;

const makePage = (
  offset: number,
  hasNext: boolean
): PokeApiListResponse => ({
  count: 40,
  next: hasNext
    ? `https://pokeapi.co/api/v2/pokemon?offset=${offset + 20}&limit=20`
    : null,
  previous: offset > 0 ? `https://pokeapi.co/api/v2/pokemon?offset=${offset - 20}&limit=20` : null,
  results: [
    {
      name: `pokemon-${offset + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/${offset + 1}/`,
    },
    {
      name: `pokemon-${offset + 2}`,
      url: `https://pokeapi.co/api/v2/pokemon/${offset + 2}/`,
    },
  ],
});

describe("usePokemonList", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("初期ロード時にisLoadingがtrueになる", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => usePokemonList());

    expect(result.current.isLoading).toBe(true);
  });

  it("データ取得後にポケモン一覧が設定される", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, true));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(2);
    expect(result.current.pokemon[0].name).toBe("Pokemon-1");
    expect(result.current.pokemon[0].id).toBe(1);
  });

  it("loadMoreで追加データが追加される", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, true));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetch.mockResolvedValueOnce(makePage(20, false));
    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(4);
  });

  it("nextがnullの場合hasMoreがfalseになる", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, false));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("hasMoreがfalseの場合loadMoreは何もしない", async () => {
    mockFetch.mockResolvedValueOnce(makePage(0, false));
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
    mockFetch.mockResolvedValueOnce(makePage(0, true));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    mockFetch.mockResolvedValueOnce(makePage(0, true));
    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.isRefreshing).toBe(false);
    });

    expect(result.current.pokemon).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenLastCalledWith(20, 0);
  });

  it("エラー時にerror状態が設定される", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const { result } = renderHook(() => usePokemonList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
  });
});
