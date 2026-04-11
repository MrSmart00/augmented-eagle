import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Pokemon } from "../domain/pokemon";
import { typeColors } from "../domain/typeColors";

interface PokemonDetailProps {
  pokemon: Pokemon;
}

export function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const imageUri = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        testID="pokemon-detail-image"
        source={{ uri: imageUri }}
        style={styles.image}
      />
      <Text style={styles.id}>{formattedId}</Text>
      <Text style={styles.name}>{pokemon.name}</Text>
      <View style={styles.typesRow}>
        {pokemon.types.map((type) => (
          <View
            key={type}
            style={[styles.badge, { backgroundColor: typeColors[type] }]}
          >
            <Text style={styles.badgeText}>{type}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: 240,
    height: 240,
  },
  id: {
    fontSize: 16,
    color: "#888",
    marginTop: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 8,
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
