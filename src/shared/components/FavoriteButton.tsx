import { useEffect, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const HEART_ANIMATION = require("../../../assets/animations/heart-favorite.json");

const ON_START = 0;
const ON_END = 90;
const OFF_START = 91;
const OFF_END = 181;

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const animationRef = useRef<LottieView>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isAnimating.current) return;
    const frame = isFavorite ? ON_END : OFF_END;
    animationRef.current?.play(frame, frame);
  }, [isFavorite]);

  const handlePress = () => {
    isAnimating.current = true;
    if (isFavorite) {
      animationRef.current?.play(OFF_START, OFF_END);
    } else {
      animationRef.current?.play(ON_START, ON_END);
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
        source={HEART_ANIMATION}
        style={styles.lottie}
        loop={false}
        autoPlay={false}
        onAnimationFinish={() => { isAnimating.current = false; }}
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
