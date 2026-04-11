import { FlatList, StyleSheet, View } from "react-native";
import { PokemonCard } from "@/src/components/PokemonCard";
import { pokemonSamples } from "@/src/data/pokemonSamples";

export default function Index() {
  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonSamples}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        contentContainerStyle={styles.list}
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
});
