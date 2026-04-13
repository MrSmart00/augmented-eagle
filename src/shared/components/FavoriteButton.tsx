import { useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const LIKE_SOURCE = require("../../../assets/animations/like.json");
const FRAME_ON_START = 0;
const FRAME_ON_END = 90;
const FRAME_OFF_START = 91;
const FRAME_OFF_END = 181;

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const animationRef = useRef<LottieView>(null);

  const handlePress = () => {
    if (isFavorite) {
      animationRef.current?.play(FRAME_OFF_START, FRAME_OFF_END);
    } else {
      animationRef.current?.play(FRAME_ON_START, FRAME_ON_END);
    }
    onToggle();
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
        source={LIKE_SOURCE}
        style={styles.lottie}
        loop={false}
        autoPlay={false}
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
