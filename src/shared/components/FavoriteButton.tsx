import { useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const HEART_ON = require("../../../assets/animations/heart-on.json");
const HEART_OFF = require("../../../assets/animations/heart-off.json");

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const sourceRef = useRef(isFavorite ? HEART_OFF : HEART_ON);
  const [playCount, setPlayCount] = useState(0);

  const handlePress = () => {
    sourceRef.current = isFavorite ? HEART_OFF : HEART_ON;
    onToggle();
    setPlayCount((c) => c + 1);
  };

  return (
    <Pressable
      testID="favorite-button"
      onPress={handlePress}
      accessibilityLabel={isFavorite ? t("favoriteButton.remove") : t("favoriteButton.add")}
      style={styles.button}
    >
      <LottieView
        key={playCount}
        testID="favorite-lottie"
        source={sourceRef.current}
        style={styles.lottie}
        loop={false}
        autoPlay={playCount > 0}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  lottie: {
    width: 48,
    height: 48,
  },
});
