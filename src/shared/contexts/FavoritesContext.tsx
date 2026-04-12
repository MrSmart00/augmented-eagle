import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Alert } from "react-native";
import { i18n } from "../i18n";

const MAX_FAVORITES = 6;

interface FavoritesContextValue {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  isFull: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fid) => fid !== id);
      }
      if (prev.length >= MAX_FAVORITES) {
        Alert.alert(i18n.t("favorites.limitTitle"), i18n.t("favorites.limitMessage"));
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const isFull = favoriteIds.length >= MAX_FAVORITES;

  const value = useMemo(
    () => ({ favoriteIds, toggleFavorite, isFavorite, isFull }),
    [favoriteIds, toggleFavorite, isFavorite, isFull],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (context === null) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
