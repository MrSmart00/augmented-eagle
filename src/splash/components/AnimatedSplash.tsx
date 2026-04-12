import { useState, useCallback, type ReactNode } from "react";
import { StyleSheet, Image, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAnimatedSplash } from "../hooks/useAnimatedSplash";

interface AnimatedSplashProps {
  children: ReactNode;
}

export function AnimatedSplash({ children }: AnimatedSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = useCallback(() => {
    setIsVisible(false);
  }, []);

  const { animatedStyle } = useAnimatedSplash({ onFinish: handleFinish });

  return (
    <View style={styles.container}>
      {children}
      {isVisible && (
        <Animated.View
          testID="animated-splash-container"
          style={[styles.splash, animatedStyle]}
          pointerEvents="none"
        >
          <Image
            testID="splash-image"
            source={require("../../../assets/images/splash-icon.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a0e27",
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: 200, height: 200 },
});
