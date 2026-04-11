import { StyleSheet, Text, View } from "react-native";

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export function StatBar({
  label,
  value,
  maxValue = 180,
  color = "#4CAF50",
}: StatBarProps) {
  const percentage = `${Math.round((value / maxValue) * 100)}%` as const;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.barBackground}>
        <View
          testID="stat-bar-fill"
          style={[styles.barFill, { width: percentage, backgroundColor: color }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    width: 60,
    fontSize: 13,
    color: "#666",
  },
  value: {
    width: 36,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 8,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
