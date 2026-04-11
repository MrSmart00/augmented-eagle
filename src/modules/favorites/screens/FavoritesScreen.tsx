import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { PokemonCard, useFavorites } from "@/src/shared";
import type { Pokemon } from "@/src/shared";
import { usePokemonByIds } from "../hooks/usePokemonByIds";

export function FavoritesScreen() {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const { pokemon: favoritePokemon, isLoading } = usePokemonByIds(favoriteIds);

  const gridData: (Pokemon | null)[] =
    favoritePokemon.length % 2 === 1
      ? [...favoritePokemon, null]
      : favoritePokemon;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>お気に入り</Text>
      {isLoading ? (
        <View style={styles.emptyContent}>
          <ActivityIndicator testID="loading-indicator" size="large" />
        </View>
      ) : favoritePokemon.length === 0 ? (
        <View style={styles.emptyContent}>
          <Text style={styles.placeholder}>
            お気に入りのポケモンはまだいません
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
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
