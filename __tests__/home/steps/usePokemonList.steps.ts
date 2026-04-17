import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { usePokemonList } from "@/src/home";
import { fetchPokemonListGraphQL } from "@/src/home/repository/pokemonGraphqlApi";
import type { PokemonListResult } from "@/src/home/repository/pokemonGraphqlApi";

jest.mock("@/src/home/repository/pokemonGraphqlApi");

const mockFetch = fetchPokemonListGraphQL as jest.MockedFunction<
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

const feature = loadFeature(
  "__tests__/home/features/usePokemonList.feature"
);

defineFeature(feature, (test) => {
  let result: { current: ReturnType<typeof usePokemonList> };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("初期ロード時にisLoadingがtrueになる", ({ given, when, then }) => {
    given("fetchPokemonListGraphQLが未解決のPromiseを返す", () => {
      mockFetch.mockReturnValue(new Promise(() => {}));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    then("isLoadingはtrueである", () => {
      expect(result.current.isLoading).toBe(true);
    });
  });

  test("データ取得後にポケモン一覧が設定される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchPokemonListGraphQLがオフセット0で総数40のデータを返す", () => {
      mockFetch.mockResolvedValueOnce(makePage(0, 40));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    then(/^ポケモン一覧の件数は(\d+)件である$/, (count: string) => {
      expect(result.current.pokemon).toHaveLength(Number(count));
    });

    and(
      /^1番目のポケモンの名前は "(.*)" である$/,
      (name: string) => {
        expect(result.current.pokemon[0].name).toBe(name);
      }
    );

    and(/^1番目のポケモンのIDは (\d+) である$/, (id: string) => {
      expect(result.current.pokemon[0].id).toBe(Number(id));
    });

    and(
      /^1番目のポケモンのタイプは "(.*)" を含む$/,
      (type: string) => {
        expect(result.current.pokemon[0].types).toEqual([type]);
      }
    );
  });

  test("言語パラメータがGraphQL関数に渡される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchPokemonListGraphQLがオフセット0で総数40のデータを返す", () => {
      mockFetch.mockResolvedValueOnce(makePage(0, 40));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      renderHook(() => usePokemonList());
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });

    then(
      /^fetchPokemonListGraphQLが (\d+) と (\d+) と "(.*)" で呼ばれる$/,
      (limit: string, offset: string, lang: string) => {
        expect(mockFetch).toHaveBeenCalledWith(
          Number(limit),
          Number(offset),
          lang
        );
      }
    );
  });

  test("loadMoreで追加データが追加される", ({ given, when, then, and }) => {
    given("fetchPokemonListGraphQLがオフセット0で総数40のデータを返す", () => {
      mockFetch.mockResolvedValueOnce(makePage(0, 40));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    and(
      "fetchPokemonListGraphQLがオフセット20で総数40の追加データを返す",
      () => {
        mockFetch.mockResolvedValueOnce(makePage(20, 40));
      }
    );

    and("loadMoreを実行する", async () => {
      await act(async () => {
        result.current.loadMore();
      });
      await waitFor(() => {
        expect(result.current.isLoadingMore).toBe(false);
      });
    });

    then(/^ポケモン一覧の件数は(\d+)件である$/, (count: string) => {
      expect(result.current.pokemon).toHaveLength(Number(count));
    });
  });

  test("総件数に達した場合hasMoreがfalseになる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchPokemonListGraphQLがオフセット0で総数2のデータを返す", () => {
      mockFetch.mockResolvedValueOnce(makePage(0, 2));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    then("hasMoreはfalseである", () => {
      expect(result.current.hasMore).toBe(false);
    });
  });

  test("hasMoreがfalseの場合loadMoreは何もしない", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchPokemonListGraphQLがオフセット0で総数2のデータを返す", () => {
      mockFetch.mockResolvedValueOnce(makePage(0, 2));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    and("loadMoreを実行する", async () => {
      await act(async () => {
        result.current.loadMore();
      });
    });

    then(/^fetchPokemonListGraphQLは(\d+)回だけ呼ばれる$/, (count: string) => {
      expect(mockFetch).toHaveBeenCalledTimes(Number(count));
    });
  });

  test("refreshでデータがリセットされる", ({ given, when, then, and }) => {
    given("fetchPokemonListGraphQLがオフセット0で総数40のデータを返す", () => {
      mockFetch.mockResolvedValueOnce(makePage(0, 40));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    and(
      "fetchPokemonListGraphQLがオフセット0で総数40のリフレッシュデータを返す",
      () => {
        mockFetch.mockResolvedValueOnce(makePage(0, 40));
      }
    );

    and("refreshを実行する", async () => {
      await act(async () => {
        result.current.refresh();
      });
      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
      });
    });

    then(/^ポケモン一覧の件数は(\d+)件である$/, (count: string) => {
      expect(result.current.pokemon).toHaveLength(Number(count));
    });

    and(/^fetchPokemonListGraphQLは(\d+)回呼ばれる$/, (count: string) => {
      expect(mockFetch).toHaveBeenCalledTimes(Number(count));
    });

    and(
      /^最後のfetchPokemonListGraphQL呼び出しは (\d+) と (\d+) と "(.*)" である$/,
      (limit: string, offset: string, lang: string) => {
        expect(mockFetch).toHaveBeenLastCalledWith(
          Number(limit),
          Number(offset),
          lang
        );
      }
    );
  });

  test("エラー時にerror状態が設定される", ({ given, when, then, and }) => {
    given(
      /^fetchPokemonListGraphQLが "(.*)" エラーを返す$/,
      (errorMessage: string) => {
        mockFetch.mockRejectedValueOnce(new Error(errorMessage));
      }
    );

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    then(/^errorは "(.*)" である$/, (expected: string) => {
      expect(result.current.error).toBe(expected);
    });
  });

  test("初期ロードでError以外のエラーでもerror状態が設定される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchPokemonListGraphQLが文字列エラーを返す", () => {
      mockFetch.mockRejectedValueOnce("string error");
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    then(/^errorは "(.*)" である$/, (expected: string) => {
      expect(result.current.error).toBe(expected);
    });
  });

  test("loadMoreでError以外のエラーでもerror状態が設定される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("fetchPokemonListGraphQLがオフセット0で総数40のデータを返す", () => {
      mockFetch.mockResolvedValueOnce(makePage(0, 40));
    });

    when("usePokemonListフックがレンダリングされる", () => {
      const hook = renderHook(() => usePokemonList());
      result = hook.result;
    });

    and("ローディングが完了する", async () => {
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    and("fetchPokemonListGraphQLが文字列エラーを返すよう設定する", () => {
      mockFetch.mockRejectedValueOnce("string error");
    });

    and("loadMoreを実行する", async () => {
      await act(async () => {
        result.current.loadMore();
      });
      await waitFor(() => {
        expect(result.current.isLoadingMore).toBe(false);
      });
    });

    then(/^errorは "(.*)" である$/, (expected: string) => {
      expect(result.current.error).toBe(expected);
    });
  });
});
