import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Pokemon } from "@/src/types/pokemon";
import { typeColors } from "@/src/constants/typeColors";

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress?: () => void;
}

export function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  const imageUri = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <Pressable testID="pokemon-card" style={styles.card} onPress={onPress}>
      <Image
        testID="pokemon-image"
        source={{ uri: imageUri }}
        style={styles.image}
      />
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  typesRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
