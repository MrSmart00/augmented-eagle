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

describe("useFavoritesStore", () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] });
    (Alert.alert as jest.Mock).mockClear();
  });

  describe("useFavorites", () => {
    it("初期状態ではお気に入りが空である", () => {
      const { result } = renderHook(() => useFavorites());
      expect(result.current.favoriteIds).toEqual([]);
    });

    it("toggleFavoriteでポケモンをお気に入りに追加できる", () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.toggleFavorite(25);
      });
      expect(result.current.favoriteIds).toEqual([25]);
    });

    it("toggleFavoriteで既にお気に入りのポケモンを削除できる", () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.toggleFavorite(25);
      });
      act(() => {
        result.current.toggleFavorite(25);
      });
      expect(result.current.favoriteIds).toEqual([]);
    });

    it("isFavoriteがお気に入り登録済みのポケモンに対してtrueを返す", () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.toggleFavorite(25);
      });
      expect(result.current.isFavorite(25)).toBe(true);
    });

    it("isFavoriteが未登録のポケモンに対してfalseを返す", () => {
      const { result } = renderHook(() => useFavorites());
      expect(result.current.isFavorite(25)).toBe(false);
    });

    it("お気に入りが6匹に達している場合、追加できずアラートが表示される", () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
        result.current.toggleFavorite(6);
      });
      expect(result.current.favoriteIds).toHaveLength(6);

      act(() => {
        result.current.toggleFavorite(7);
      });
      expect(result.current.favoriteIds).toHaveLength(6);
      expect(result.current.favoriteIds).not.toContain(7);
      expect(Alert.alert).toHaveBeenCalledWith(
        "favorites.limitTitle",
        "favorites.limitMessage"
      );
    });

    it("上限に達していても既存のお気に入りは削除できる", () => {
      const { result } = renderHook(() => useFavorites());
      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
        result.current.toggleFavorite(6);
      });

      act(() => {
        result.current.toggleFavorite(3);
      });
      expect(result.current.favoriteIds).toHaveLength(5);
      expect(result.current.favoriteIds).not.toContain(3);
    });

    it("isFullが上限到達時にtrueを返す", () => {
      const { result } = renderHook(() => useFavorites());
      expect(result.current.isFull).toBe(false);

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
        result.current.toggleFavorite(6);
      });
      expect(result.current.isFull).toBe(true);
    });
  });
});
