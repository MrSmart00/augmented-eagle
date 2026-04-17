import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useFavorites } from "@/src/shared";
import { useFavoritesStore } from "@/src/shared/stores/useFavoritesStore";

jest.mock("@/src/shared/i18n", () => ({
  i18n: {
    t: (key: string) => key,
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

const feature = loadFeature(
  "__tests__/shared/features/useFavoritesStore.feature"
);

defineFeature(feature, (test) => {
  let result: ReturnType<
    typeof renderHook<ReturnType<typeof useFavorites>, unknown>
  >["result"];

  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] });
    (Alert.alert as jest.Mock).mockClear();
  });

  test("初期状態ではお気に入りが空である", ({ given, when, then }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    then("お気に入りリストが空である", () => {
      expect(result.current.favoriteIds).toEqual([]);
    });
  });

  test("toggleFavoriteでポケモンをお気に入りに追加できる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    and(/^ポケモンID (\d+) をトグルする$/, (id: string) => {
      act(() => {
        result.current.toggleFavorite(Number(id));
      });
    });

    then(/^お気に入りリストに (\d+) が含まれる$/, (id: string) => {
      expect(result.current.favoriteIds).toEqual([Number(id)]);
    });
  });

  test("toggleFavoriteで既にお気に入りのポケモンを削除できる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    and(/^ポケモンID (\d+) をトグルする$/, (id: string) => {
      act(() => {
        result.current.toggleFavorite(Number(id));
      });
    });

    and(/^ポケモンID (\d+) をトグルする$/, (id: string) => {
      act(() => {
        result.current.toggleFavorite(Number(id));
      });
    });

    then("お気に入りリストが空である", () => {
      expect(result.current.favoriteIds).toEqual([]);
    });
  });

  test("isFavoriteがお気に入り登録済みのポケモンに対してtrueを返す", ({
    given,
    when,
    then,
    and,
  }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    and(/^ポケモンID (\d+) をトグルする$/, (id: string) => {
      act(() => {
        result.current.toggleFavorite(Number(id));
      });
    });

    then(/^ポケモンID (\d+) がお気に入りである$/, (id: string) => {
      expect(result.current.isFavorite(Number(id))).toBe(true);
    });
  });

  test("isFavoriteが未登録のポケモンに対してfalseを返す", ({
    given,
    when,
    then,
  }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    then(/^ポケモンID (\d+) がお気に入りでない$/, (id: string) => {
      expect(result.current.isFavorite(Number(id))).toBe(false);
    });
  });

  test("お気に入りが6匹に達している場合、追加できずアラートが表示される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    and("6匹のポケモンをお気に入りに追加する", () => {
      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
        result.current.toggleFavorite(6);
      });
    });

    and(/^ポケモンID (\d+) をトグルする$/, (id: string) => {
      act(() => {
        result.current.toggleFavorite(Number(id));
      });
    });

    then(/^お気に入りの数が (\d+) である$/, (count: string) => {
      expect(result.current.favoriteIds).toHaveLength(Number(count));
    });

    and(/^お気に入りリストに (\d+) が含まれない$/, (id: string) => {
      expect(result.current.favoriteIds).not.toContain(Number(id));
    });

    and("アラートが表示される", () => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "favorites.limitTitle",
        "favorites.limitMessage"
      );
    });
  });

  test("上限に達していても既存のお気に入りは削除できる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    and("6匹のポケモンをお気に入りに追加する", () => {
      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
        result.current.toggleFavorite(6);
      });
    });

    and(/^ポケモンID (\d+) をトグルする$/, (id: string) => {
      act(() => {
        result.current.toggleFavorite(Number(id));
      });
    });

    then(/^お気に入りの数が (\d+) である$/, (count: string) => {
      expect(result.current.favoriteIds).toHaveLength(Number(count));
    });

    and(/^お気に入りリストに (\d+) が含まれない$/, (id: string) => {
      expect(result.current.favoriteIds).not.toContain(Number(id));
    });
  });

  test("isFullが上限到達時にtrueを返す", ({ given, when, then }) => {
    given("お気に入りストアが初期状態である", () => {
      // reset in beforeEach
    });

    when("useFavoritesフックを実行する", () => {
      const hook = renderHook(() => useFavorites());
      result = hook.result;
    });

    then("isFullがfalseである", () => {
      expect(result.current.isFull).toBe(false);
    });

    when("6匹のポケモンをお気に入りに追加する", () => {
      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
        result.current.toggleFavorite(6);
      });
    });

    then("isFullがtrueである", () => {
      expect(result.current.isFull).toBe(true);
    });
  });
});
