import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { PokemonStat } from "@/src/shared";
import { StatBar } from "./StatBar";

interface PokemonStatsProps {
  stats: PokemonStat[];
}

const statColorMap: Record<string, string> = {
  hp: "#FF5252",
  attack: "#FF9800",
  defense: "#2196F3",
  "special-attack": "#9C27B0",
  "special-defense": "#4CAF50",
  speed: "#F44336",
};

export function PokemonStats({ stats }: PokemonStatsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("detail.baseStats")}</Text>
      {stats.map((stat) => (
        <StatBar
          key={stat.name}
          label={t(`detail.stats.${stat.name}`, { defaultValue: stat.name })}
          value={stat.baseStat}
          color={statColorMap[stat.name]}
        />
      ))}
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
});
