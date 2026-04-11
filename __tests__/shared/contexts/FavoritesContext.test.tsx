import { renderHook, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import { FavoritesProvider, useFavorites } from "@/src/shared";

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("FavoritesContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  );

  beforeEach(() => {
    (Alert.alert as jest.Mock).mockClear();
  });

  describe("useFavorites", () => {
    it("初期状態ではお気に入りが空である", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      expect(result.current.favoriteIds).toEqual([]);
    });

    it("toggleFavoriteでポケモンをお気に入りに追加できる", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      act(() => {
        result.current.toggleFavorite(25);
      });
      expect(result.current.favoriteIds).toEqual([25]);
    });

    it("toggleFavoriteで既にお気に入りのポケモンを削除できる", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      act(() => {
        result.current.toggleFavorite(25);
      });
      act(() => {
        result.current.toggleFavorite(25);
      });
      expect(result.current.favoriteIds).toEqual([]);
    });

    it("isFavoriteがお気に入り登録済みのポケモンに対してtrueを返す", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      act(() => {
        result.current.toggleFavorite(25);
      });
      expect(result.current.isFavorite(25)).toBe(true);
    });

    it("isFavoriteが未登録のポケモンに対してfalseを返す", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      expect(result.current.isFavorite(25)).toBe(false);
    });

    it("お気に入りが5匹に達している場合、追加できずアラートが表示される", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
      });
      expect(result.current.favoriteIds).toHaveLength(5);

      act(() => {
        result.current.toggleFavorite(6);
      });
      expect(result.current.favoriteIds).toHaveLength(5);
      expect(result.current.favoriteIds).not.toContain(6);
      expect(Alert.alert).toHaveBeenCalledWith(
        "お気に入り上限",
        "お気に入りは5匹までです"
      );
    });

    it("上限に達していても既存のお気に入りは削除できる", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
      });

      act(() => {
        result.current.toggleFavorite(3);
      });
      expect(result.current.favoriteIds).toHaveLength(4);
      expect(result.current.favoriteIds).not.toContain(3);
    });

    it("isFullが上限到達時にtrueを返す", () => {
      const { result } = renderHook(() => useFavorites(), { wrapper });
      expect(result.current.isFull).toBe(false);

      act(() => {
        result.current.toggleFavorite(1);
        result.current.toggleFavorite(2);
        result.current.toggleFavorite(3);
        result.current.toggleFavorite(4);
        result.current.toggleFavorite(5);
      });
      expect(result.current.isFull).toBe(true);
    });

    it("Provider外でuseFavoritesを呼ぶとエラーになる", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      expect(() => {
        renderHook(() => useFavorites());
      }).toThrow("useFavorites must be used within a FavoritesProvider");
      jest.restoreAllMocks();
    });
  });
});
