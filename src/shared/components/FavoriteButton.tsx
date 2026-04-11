import { Pressable, StyleSheet, Text } from "react-native";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <Pressable
      testID="favorite-button"
      onPress={onToggle}
      accessibilityLabel={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
      style={styles.button}
    >
      <Text style={[styles.heart, isFavorite && styles.heartActive]}>
        {isFavorite ? "♥" : "♡"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  heart: {
    fontSize: 24,
    color: "#ccc",
  },
  heartActive: {
    color: "#e74c3c",
  },
});
