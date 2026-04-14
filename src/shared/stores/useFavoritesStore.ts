import { create } from "zustand";
import { Alert } from "react-native";
import { i18n } from "../i18n";

const MAX_FAVORITES = 6;

interface FavoritesStoreState {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
}

interface FavoritesValue extends FavoritesStoreState {
  isFavorite: (id: number) => boolean;
  isFull: boolean;
}

export const useFavoritesStore = create<FavoritesStoreState>((set, get) => ({
  favoriteIds: [],

  toggleFavorite: (id: number) => {
    const { favoriteIds } = get();
    if (favoriteIds.includes(id)) {
      set({ favoriteIds: favoriteIds.filter((fid) => fid !== id) });
      return;
    }
    if (favoriteIds.length >= MAX_FAVORITES) {
      Alert.alert(i18n.t("favorites.limitTitle"), i18n.t("favorites.limitMessage"));
      return;
    }
    set({ favoriteIds: [...favoriteIds, id] });
  },
}));

export function useFavorites(): FavoritesValue {
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  return {
    favoriteIds,
    toggleFavorite,
    isFavorite: (id: number) => favoriteIds.includes(id),
    isFull: favoriteIds.length >= MAX_FAVORITES,
  };
}
