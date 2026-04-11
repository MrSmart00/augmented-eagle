import { StyleSheet, Text, View } from "react-native";
import type { PokemonAbility } from "@/src/shared";

interface PokemonAbilitiesProps {
  abilities: PokemonAbility[];
}

function capitalizeName(name: string): string {
  if (name.length === 0) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Abilities</Text>
      <View style={styles.list}>
        {abilities.map((ability) => (
          <View key={ability.name} style={styles.badge}>
            <Text style={styles.badgeText}>
              {capitalizeName(ability.name)}
              {ability.isHidden ? " (Hidden)" : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#e8e8e8",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 14,
    color: "#333",
  },
});
