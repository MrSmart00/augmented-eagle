import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface PokemonFlavorTextProps {
  text: string | null;
  isLoading?: boolean;
}

export function PokemonFlavorText({ text, isLoading }: PokemonFlavorTextProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator testID="flavor-text-loading" size="small" />
      </View>
    );
  }

  if (!text) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    textAlign: "center",
    fontStyle: "italic",
  },
});
