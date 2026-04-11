import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { PokemonCard } from "../components/PokemonCard";
import { pokemonSamples } from "../repository/pokemonSamples";
import type { Pokemon } from "../domain/pokemon";

const gridData: (Pokemon | null)[] =
  pokemonSamples.length % 2 === 1
    ? [...pokemonSamples, null]
    : pokemonSamples;

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={gridData}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            {item && (
              <Link href={`/detail/${item.id}`} asChild>
                <PokemonCard pokemon={item} />
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
