import { renderHook, act } from "@testing-library/react-native";
import { FavoritesProvider, useFavorites } from "@/src/shared";

describe("FavoritesContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  );

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

    it("Provider外でuseFavoritesを呼ぶとエラーになる", () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      expect(() => {
        renderHook(() => useFavorites());
      }).toThrow("useFavorites must be used within a FavoritesProvider");
      jest.restoreAllMocks();
    });
  });
});
