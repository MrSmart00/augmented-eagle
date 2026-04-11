import React from "react";
import { Text } from "react-native";
import { render, act } from "@testing-library/react-native";
import { AnimatedSplash } from "@/src/modules/splash/components/AnimatedSplash";

let mockOnFinish: (() => void) | undefined;
jest.mock("@/src/modules/splash/hooks/useAnimatedSplash", () => ({
  useAnimatedSplash: ({ onFinish }: { onFinish: () => void }) => {
    mockOnFinish = onFinish;
    return { animatedStyle: { opacity: 1, transform: [{ scale: 1 }] } };
  },
}));

describe("AnimatedSplash", () => {
  beforeEach(() => {
    mockOnFinish = undefined;
  });

  it("スプラッシュ画像が表示される", () => {
    const { getByTestId } = render(
      <AnimatedSplash>
        <Text>Main</Text>
      </AnimatedSplash>,
    );

    expect(getByTestId("splash-image")).toBeTruthy();
  });

  it("スプラッシュコンテナがフルスクリーンで表示される", () => {
    const { getByTestId } = render(
      <AnimatedSplash>
        <Text>Main</Text>
      </AnimatedSplash>,
    );

    expect(getByTestId("animated-splash-container")).toBeTruthy();
  });

  it("子要素が表示される", () => {
    const { getByText } = render(
      <AnimatedSplash>
        <Text>Main Content</Text>
      </AnimatedSplash>,
    );

    expect(getByText("Main Content")).toBeTruthy();
  });

  it("アニメーション完了後にスプラッシュオーバーレイが非表示になる", () => {
    const { queryByTestId } = render(
      <AnimatedSplash>
        <Text>Main</Text>
      </AnimatedSplash>,
    );

    expect(queryByTestId("animated-splash-container")).toBeTruthy();

    act(() => {
      mockOnFinish?.();
    });

    expect(queryByTestId("animated-splash-container")).toBeNull();
  });
});
