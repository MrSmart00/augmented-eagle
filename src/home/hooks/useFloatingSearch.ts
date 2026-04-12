import { useState, useCallback } from "react";
import { Dimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const FAB_SIZE = 56;
const EXPANDED_WIDTH = SCREEN_WIDTH - 32;
const EXPANDED_HEIGHT = 48;
const FAB_RADIUS = FAB_SIZE / 2;
const EXPANDED_RADIUS = EXPANDED_HEIGHT / 2;
const ANIMATION_DURATION = 300;

export function useFloatingSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = useSharedValue(0);

  const animateTo = useCallback(
    (toValue: number) => {
      progress.value = withTiming(toValue, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease),
      });
    },
    [progress],
  );

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
    animateTo(isExpanded ? 0 : 1);
  }, [animateTo, isExpanded]);

  const close = useCallback(() => {
    setIsExpanded(false);
    animateTo(0);
  }, [animateTo]);

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [FAB_SIZE, EXPANDED_WIDTH]),
    height: interpolate(progress.value, [0, 1], [FAB_SIZE, EXPANDED_HEIGHT]),
    borderRadius: interpolate(
      progress.value,
      [0, 1],
      [FAB_RADIUS, EXPANDED_RADIUS],
    ),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  return {
    isExpanded,
    toggle,
    close,
    fabAnimatedStyle,
    iconAnimatedStyle,
    inputAnimatedStyle,
  };
}
