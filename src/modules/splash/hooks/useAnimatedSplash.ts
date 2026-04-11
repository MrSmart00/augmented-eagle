import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

interface UseAnimatedSplashOptions {
  delay?: number;
  duration?: number;
  onFinish: () => void;
}

export function useAnimatedSplash({
  delay = 800,
  duration = 600,
  onFinish,
}: UseAnimatedSplashOptions) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    SplashScreen.hideAsync();

    const timer = setTimeout(() => {
      opacity.value = withTiming(
        0,
        { duration, easing: Easing.out(Easing.ease) },
      );
      scale.value = withTiming(
        1.5,
        { duration, easing: Easing.out(Easing.ease) },
        (finished) => {
          if (finished) {
            runOnJS(onFinish)();
          }
        },
      );
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle };
}
