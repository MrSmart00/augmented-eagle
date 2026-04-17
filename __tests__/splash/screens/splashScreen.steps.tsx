import { defineFeature, loadFeature } from "jest-cucumber";
import React from "react";
import { Text } from "react-native";
import { render, act } from "@testing-library/react-native";
import { AnimatedSplash } from "@/src/splash";

let mockOnFinish: (() => void) | undefined;
jest.mock("@/src/splash/hooks/useAnimatedSplash", () => ({
  useAnimatedSplash: jest.fn(({ onFinish }: { onFinish: () => void }) => {
    mockOnFinish = onFinish;
    return { animatedStyle: { opacity: 1, transform: [{ scale: 1 }] } };
  }),
}));

const feature = loadFeature(
  "__tests__/splash/screens/splashScreen.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    mockOnFinish = undefined;
    jest.clearAllMocks();
  });

  test("スプラッシュ画像が表示される", ({ given, when, then }) => {
    let getByTestId: ReturnType<typeof render>["getByTestId"];

    given("スプラッシュコンポーネントに子要素がある", () => {
      // setup in when
    });

    when("スプラッシュ画面をレンダーする", () => {
      const result = render(
        <AnimatedSplash>
          <Text>Main</Text>
        </AnimatedSplash>
      );
      getByTestId = result.getByTestId;
    });

    then("スプラッシュ画像が表示される", () => {
      expect(getByTestId("splash-image")).toBeTruthy();
    });
  });

  test("スプラッシュコンテナがフルスクリーンで表示される", ({ given, when, then }) => {
    let getByTestId: ReturnType<typeof render>["getByTestId"];

    given("スプラッシュコンポーネントに子要素がある", () => {
      // setup in when
    });

    when("スプラッシュ画面をレンダーする", () => {
      const result = render(
        <AnimatedSplash>
          <Text>Main</Text>
        </AnimatedSplash>
      );
      getByTestId = result.getByTestId;
    });

    then("スプラッシュコンテナが表示される", () => {
      expect(getByTestId("animated-splash-container")).toBeTruthy();
    });
  });

  test("子要素が表示される", ({ given, when, then }) => {
    let getByText: ReturnType<typeof render>["getByText"];

    given(/^スプラッシュコンポーネントに "Main Content" という子要素がある$/, () => {
      // setup in when
    });

    when("スプラッシュ画面をレンダーする", () => {
      const result = render(
        <AnimatedSplash>
          <Text>Main Content</Text>
        </AnimatedSplash>
      );
      getByText = result.getByText;
    });

    then(/^"Main Content" が表示される$/, () => {
      expect(getByText("Main Content")).toBeTruthy();
    });
  });

  test("アニメーション完了後にスプラッシュオーバーレイが非表示になる", ({ given, when, then }) => {
    let queryByTestId: ReturnType<typeof render>["queryByTestId"];

    given("スプラッシュコンポーネントに子要素がある", () => {
      // setup in when
    });

    when("スプラッシュ画面をレンダーしてアニメーションが完了する", () => {
      const result = render(
        <AnimatedSplash>
          <Text>Main</Text>
        </AnimatedSplash>
      );
      queryByTestId = result.queryByTestId;

      expect(queryByTestId("animated-splash-container")).toBeTruthy();

      act(() => {
        mockOnFinish?.();
      });
    });

    then("スプラッシュオーバーレイが非表示になる", () => {
      expect(queryByTestId("animated-splash-container")).toBeNull();
    });
  });
});
