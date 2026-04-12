import { useEffect, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const HEART_ANIMATION = require("../../../assets/animations/heart-favorite.json");

const TOTAL_FRAMES = 181;
const ON_START = 0;
const ON_END = 90;
const OFF_START = 91;
const OFF_END = 181;

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const animationRef = useRef<LottieView>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isFavorite) {
      animationRef.current?.play(ON_START, ON_END);
    } else {
      animationRef.current?.play(OFF_START, OFF_END);
    }
  }, [isFavorite]);

  return (
    <Pressable
      testID="favorite-button"
      onPress={onToggle}
      accessibilityLabel={isFavorite ? t("favoriteButton.remove") : t("favoriteButton.add")}
      style={styles.button}
    >
      <LottieView
        ref={animationRef}
        testID="favorite-lottie"
        source={HEART_ANIMATION}
        progress={isFavorite ? ON_END / TOTAL_FRAMES : OFF_END / TOTAL_FRAMES}
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
