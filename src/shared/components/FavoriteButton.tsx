import { useRef } from "react";
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
  const animationRef = useRef<LottieView>(null);

  const handlePress = () => {
    animationRef.current?.play();
  };

  return (
    <Pressable
      testID="favorite-button"
      onPress={handlePress}
      accessibilityLabel={isFavorite ? t("favoriteButton.remove") : t("favoriteButton.add")}
      style={styles.button}
    >
      <LottieView
        ref={animationRef}
        testID="favorite-lottie"
        source={isFavorite ? HEART_OFF : HEART_ON}
        style={styles.lottie}
        loop={false}
        autoPlay={false}
        onAnimationFinish={onToggle}
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
