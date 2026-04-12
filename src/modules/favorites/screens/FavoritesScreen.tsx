import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { PokemonCard, useFavorites } from "@/src/shared";
import type { PokemonSummary } from "@/src/shared";
import { usePokemonByIds } from "../hooks/usePokemonByIds";

export function FavoritesScreen() {
  const { t } = useTranslation();
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const { pokemon: favoritePokemon, isLoading } = usePokemonByIds(favoriteIds);

  const gridData: (PokemonSummary | null)[] =
    favoritePokemon.length % 2 === 1
      ? [...favoritePokemon, null]
      : favoritePokemon;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.emptyContent}>
          <ActivityIndicator testID="loading-indicator" size="large" />
        </View>
      ) : favoritePokemon.length === 0 ? (
        <View style={styles.emptyContent}>
          <Text style={styles.placeholder}>
            {t("favorites.empty")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={gridData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              {item && (
                <Link href={`/detail/${item.id}`} asChild>
                  <PokemonCard
                    pokemon={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                  />
                </Link>
              )}
            </View>
          )}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  placeholder: {
    fontSize: 16,
    color: "#888",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  row: {
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
});
