import { StyleSheet, Text, View } from "react-native";
import { PokemonDetail } from "../components/PokemonDetail";
import { pokemonSamples } from "../repository/pokemonSamples";

interface DetailScreenProps {
  id: string;
}

export function DetailScreen({ id }: DetailScreenProps) {
  const pokemon = pokemonSamples.find((p) => p.id === Number(id));

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ポケモンが見つかりません</Text>
      </View>
    );
  }

  return <PokemonDetail pokemon={pokemon} />;
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
