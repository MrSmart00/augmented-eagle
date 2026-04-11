import { StyleSheet, Text, View } from "react-native";
import { PokemonDetail, pokemonSamples, useFavorites } from "@/src/shared";

interface DetailScreenProps {
  id: string;
}

export function DetailScreen({ id }: DetailScreenProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const pokemon = pokemonSamples.find((p) => p.id === Number(id));

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ポケモンが見つかりません</Text>
      </View>
    );
  }

  return (
    <PokemonDetail
      pokemon={pokemon}
      isFavorite={isFavorite(pokemon.id)}
      onToggleFavorite={() => toggleFavorite(pokemon.id)}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#888",
  },
});
