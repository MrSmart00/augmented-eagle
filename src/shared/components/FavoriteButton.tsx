import { Pressable, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      testID="favorite-button"
      onPress={onToggle}
      accessibilityLabel={isFavorite ? t("favoriteButton.remove") : t("favoriteButton.add")}
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
