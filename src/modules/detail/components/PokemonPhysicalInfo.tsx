import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface PokemonPhysicalInfoProps {
  height: number;
  weight: number;
}

export function PokemonPhysicalInfo({ height, weight }: PokemonPhysicalInfoProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>{t("detail.height")}</Text>
        <Text style={styles.value}>{(height / 10).toFixed(1)}{t("detail.heightUnit")}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>{t("detail.weight")}</Text>
        <Text style={styles.value}>{(weight / 10).toFixed(1)}{t("detail.weightUnit")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  item: {
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
