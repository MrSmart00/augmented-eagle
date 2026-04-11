import { FlatList, StyleSheet, View } from "react-native";
import { PokemonCard } from "@/src/components/PokemonCard";
import { pokemonSamples } from "@/src/data/pokemonSamples";
import type { Pokemon } from "@/src/types/pokemon";

const gridData: (Pokemon | null)[] =
  pokemonSamples.length % 2 === 1
    ? [...pokemonSamples, null]
    : pokemonSamples;

export default function Index() {
  return (
    <View style={styles.container}>
      <FlatList
        data={gridData}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            {item && <PokemonCard pokemon={item} />}
          </View>
        )}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
    gap: 16,
  },
  row: {
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
});
