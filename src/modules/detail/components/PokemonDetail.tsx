import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Pokemon } from "@/src/shared";
import { typeColors, FavoriteButton } from "@/src/shared";
import { PokemonPhysicalInfo } from "./PokemonPhysicalInfo";
import { PokemonAbilities } from "./PokemonAbilities";
import { PokemonStats } from "./PokemonStats";
import { PokemonFlavorText } from "./PokemonFlavorText";

interface PokemonDetailProps {
  pokemon: Pokemon;
  localizedName?: string | null;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  flavorText?: string | null;
  isFlavorTextLoading?: boolean;
}

export function PokemonDetail({
  pokemon,
  localizedName,
  isFavorite,
  onToggleFavorite,
  flavorText,
  isFlavorTextLoading,
}: PokemonDetailProps) {
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
      <View style={styles.nameRow}>
        <Text style={styles.name}>{localizedName ?? pokemon.name}</Text>
        {isFavorite !== undefined && onToggleFavorite && (
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
        )}
      </View>
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
      <PokemonFlavorText text={flavorText ?? null} isLoading={isFlavorTextLoading} />
      <PokemonPhysicalInfo height={pokemon.height} weight={pokemon.weight} />
      <PokemonAbilities abilities={pokemon.abilities} />
      <PokemonStats stats={pokemon.stats} />
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
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
