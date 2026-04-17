import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, act } from "@testing-library/react-native";
import * as SplashScreen from "expo-splash-screen";
import { useAnimatedSplash } from "@/src/splash/hooks/useAnimatedSplash";

const feature = loadFeature(
  "__tests__/splash/features/useAnimatedSplash.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("マウント時にSplashScreen.hideAsyncが呼ばれる", ({ given, when, then }) => {
    let onFinish: jest.Mock;

    given("onFinishコールバックが用意されている", () => {
      onFinish = jest.fn();
    });

    when("フックをレンダーする", () => {
      renderHook(() => useAnimatedSplash({ onFinish }));
    });

    then(/^SplashScreen\.hideAsyncが1回呼ばれる$/, () => {
      expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
    });
  });

  test("delay前にはonFinishが呼ばれない", ({ given, when, then }) => {
    let onFinish: jest.Mock;

    given(/^onFinishコールバックとdelay 800ms が用意されている$/, () => {
      onFinish = jest.fn();
    });

    when(/^フックをレンダーして500ms経過する$/, () => {
      renderHook(() => useAnimatedSplash({ onFinish, delay: 800 }));
      act(() => {
        jest.advanceTimersByTime(500);
      });
    });

    then("onFinishは呼ばれていない", () => {
      expect(onFinish).not.toHaveBeenCalled();
    });
  });

  test("delay後にonFinishコールバックが呼ばれる", ({ given, when, then }) => {
    let onFinish: jest.Mock;

    given(/^onFinishコールバックとdelay 800ms が用意されている$/, () => {
      onFinish = jest.fn();
    });

    when(/^フックをレンダーして800ms経過する$/, () => {
      renderHook(() => useAnimatedSplash({ onFinish, delay: 800 }));
      act(() => {
        jest.advanceTimersByTime(800);
      });
    });

    then("onFinishが1回呼ばれる", () => {
      expect(onFinish).toHaveBeenCalledTimes(1);
    });
  });

  test("アンマウント時にタイマーがクリーンアップされる", ({ given, when, then }) => {
    let onFinish: jest.Mock;

    given(/^onFinishコールバックとdelay 800ms が用意されている$/, () => {
      onFinish = jest.fn();
    });

    when(/^フックをレンダーしてアンマウントし1000ms経過する$/, () => {
      const { unmount } = renderHook(() =>
        useAnimatedSplash({ onFinish, delay: 800 })
      );
      unmount();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    });

    then("onFinishは呼ばれていない", () => {
      expect(onFinish).not.toHaveBeenCalled();
    });
  });

  test("animatedStyleオブジェクトを返す", ({ given, when, then, and }) => {
    let onFinish: jest.Mock;
    let hookResult: { current: ReturnType<typeof useAnimatedSplash> };

    given("onFinishコールバックが用意されている", () => {
      onFinish = jest.fn();
    });

    when("フックをレンダーする", () => {
      const { result } = renderHook(() => useAnimatedSplash({ onFinish }));
      hookResult = result;
    });

    then("animatedStyleにopacityプロパティがある", () => {
      expect(hookResult.current.animatedStyle).toBeDefined();
      expect(hookResult.current.animatedStyle).toHaveProperty("opacity");
    });

    and("animatedStyleにtransformプロパティがある", () => {
      expect(hookResult.current.animatedStyle).toHaveProperty("transform");
    });
  });
});
