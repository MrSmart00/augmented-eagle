import { renderHook, act } from "@testing-library/react-native";
import * as SplashScreen from "expo-splash-screen";

// useAnimatedSplashはバレルにエクスポートされていないため直接require
function getRealUseAnimatedSplash() {
  const { useAnimatedSplash } = jest.requireActual<
    typeof import("@/src/splash/hooks/useAnimatedSplash")
  >("@/src/splash/hooks/useAnimatedSplash");
  return useAnimatedSplash;
}

describe("useAnimatedSplash", () => {
  it("マウント時にSplashScreen.hideAsyncが呼ばれる", () => {
    const onFinish = jest.fn();
    jest.useFakeTimers();

    const useAnimatedSplash = getRealUseAnimatedSplash();
    renderHook(() => useAnimatedSplash({ onFinish }));

    expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("delay前にはonFinishが呼ばれない", () => {
    const onFinish = jest.fn();
    jest.useFakeTimers();

    const useAnimatedSplash = getRealUseAnimatedSplash();
    renderHook(() => useAnimatedSplash({ onFinish, delay: 800 }));
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onFinish).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("delay後にonFinishコールバックが呼ばれる", () => {
    const onFinish = jest.fn();
    jest.useFakeTimers();

    const useAnimatedSplash = getRealUseAnimatedSplash();
    renderHook(() => useAnimatedSplash({ onFinish, delay: 800 }));
    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("アンマウント時にタイマーがクリーンアップされる", () => {
    const onFinish = jest.fn();
    jest.useFakeTimers();

    const useAnimatedSplash = getRealUseAnimatedSplash();
    const { unmount } = renderHook(() =>
      useAnimatedSplash({ onFinish, delay: 800 })
    );
    unmount();
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onFinish).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("animatedStyleオブジェクトを返す", () => {
    const onFinish = jest.fn();
    jest.useFakeTimers();

    const useAnimatedSplash = getRealUseAnimatedSplash();
    const { result } = renderHook(() => useAnimatedSplash({ onFinish }));

    expect(result.current.animatedStyle).toBeDefined();
    expect(result.current.animatedStyle).toHaveProperty("opacity");
    expect(result.current.animatedStyle).toHaveProperty("transform");
    jest.useRealTimers();
  });
});
