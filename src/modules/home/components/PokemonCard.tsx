import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Pokemon } from "../domain/pokemon";
import { typeColors } from "../domain/typeColors";
import { FavoriteButton } from "./FavoriteButton";

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function PokemonCard({
  pokemon,
  onPress,
  isFavorite,
  onToggleFavorite,
}: PokemonCardProps) {
  const imageUri = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <Pressable testID="pokemon-card" style={styles.card} onPress={onPress}>
      {isFavorite !== undefined && onToggleFavorite && (
        <View style={styles.favoriteWrapper}>
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
        </View>
      )}
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
  favoriteWrapper: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
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
