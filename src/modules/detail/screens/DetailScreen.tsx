import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useFavorites } from "@/src/shared";
import { PokemonDetail } from "../components/PokemonDetail";
import { usePokemonById } from "../hooks/usePokemonById";

interface DetailScreenProps {
  id: string;
}

export function DetailScreen({ id }: DetailScreenProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { pokemon, isLoading, error } = usePokemonById(Number(id));

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator testID="loading-indicator" size="large" />
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centered}>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#888",
  },
});
