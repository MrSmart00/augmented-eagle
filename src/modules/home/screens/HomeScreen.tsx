import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { PokemonCard } from "../components/PokemonCard";
import { pokemonSamples } from "../repository/pokemonSamples";
import { useSearch } from "../hooks/useSearch";
import { useFavorites } from "@/src/shared";
import type { Pokemon } from "../domain/pokemon";

export function HomeScreen() {
  const { searchText, setSearchText, filteredItems } =
    useSearch(pokemonSamples);
  const { isFavorite, toggleFavorite } = useFavorites();

  const gridData: (Pokemon | null)[] =
    filteredItems.length % 2 === 1 ? [...filteredItems, null] : filteredItems;

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        testID="search-input"
        style={styles.searchInput}
        placeholder="ポケモンを検索..."
        value={searchText}
        onChangeText={setSearchText}
      />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    gap: 16,
  },
  row: {
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
});
