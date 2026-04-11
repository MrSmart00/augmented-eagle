import { StyleSheet, Text, View } from "react-native";

interface PokemonPhysicalInfoProps {
  height: number;
  weight: number;
}

export function PokemonPhysicalInfo({ height, weight }: PokemonPhysicalInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Height</Text>
        <Text style={styles.value}>{(height / 10).toFixed(1)} m</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Weight</Text>
        <Text style={styles.value}>{(weight / 10).toFixed(1)} kg</Text>
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
