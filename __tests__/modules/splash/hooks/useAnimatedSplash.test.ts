import { renderHook, act } from "@testing-library/react-native";
import * as SplashScreen from "expo-splash-screen";
import { useAnimatedSplash } from "@/src/modules/splash/hooks/useAnimatedSplash";

describe("useAnimatedSplash", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("マウント時にSplashScreen.hideAsyncが呼ばれる", () => {
    const onFinish = jest.fn();
    renderHook(() => useAnimatedSplash({ onFinish }));

    expect(SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
  });

  it("delay前にはonFinishが呼ばれない", () => {
    const onFinish = jest.fn();
    renderHook(() => useAnimatedSplash({ onFinish, delay: 800 }));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onFinish).not.toHaveBeenCalled();
  });

  it("delay後にonFinishコールバックが呼ばれる", () => {
    const onFinish = jest.fn();
    renderHook(() => useAnimatedSplash({ onFinish, delay: 800 }));

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it("アンマウント時にタイマーがクリーンアップされる", () => {
    const onFinish = jest.fn();
    const { unmount } = renderHook(() =>
      useAnimatedSplash({ onFinish, delay: 800 }),
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onFinish).not.toHaveBeenCalled();
  });

  it("animatedStyleオブジェクトを返す", () => {
    const onFinish = jest.fn();
    const { result } = renderHook(() => useAnimatedSplash({ onFinish }));

    expect(result.current.animatedStyle).toBeDefined();
    expect(result.current.animatedStyle).toHaveProperty("opacity");
    expect(result.current.animatedStyle).toHaveProperty("transform");
  });
});
