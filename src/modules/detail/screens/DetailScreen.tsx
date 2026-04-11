import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFavorites } from "@/src/shared";
import { PokemonDetail } from "../components/PokemonDetail";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import { usePokemonSpeciesInfo } from "../hooks/usePokemonSpeciesInfo";

interface DetailScreenProps {
  id: string;
}

export function DetailScreen({ id }: DetailScreenProps) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const numericId = Number(id);
  const { pokemon, isLoading, error } = usePokemonDetail(numericId);
  const { flavorText, localizedName, isLoading: isSpeciesLoading } = usePokemonSpeciesInfo(numericId);

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
        <Text style={styles.errorText}>{t("detail.notFound")}</Text>
      </View>
    );
  }

  return (
    <PokemonDetail
      pokemon={pokemon}
      localizedName={localizedName}
      isFavorite={isFavorite(pokemon.id)}
      onToggleFavorite={() => toggleFavorite(pokemon.id)}
      flavorText={flavorText}
      isFlavorTextLoading={isSpeciesLoading}
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
