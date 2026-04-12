import { renderHook, act } from "@testing-library/react-native";
import { useFloatingSearch } from "@/src/modules/home/hooks/useFloatingSearch";

describe("useFloatingSearch", () => {
  it("初期状態でisExpandedがfalse", () => {
    const { result } = renderHook(() => useFloatingSearch());
    expect(result.current.isExpanded).toBe(false);
  });

  it("toggle()で展開状態が切り替わる", () => {
    const { result } = renderHook(() => useFloatingSearch());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isExpanded).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isExpanded).toBe(false);
  });

  it("close()で常に折りたたまれる", () => {
    const { result } = renderHook(() => useFloatingSearch());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isExpanded).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isExpanded).toBe(false);
  });

  it("close()は折りたたみ状態でも安全に呼べる", () => {
    const { result } = renderHook(() => useFloatingSearch());

    act(() => {
      result.current.close();
    });
    expect(result.current.isExpanded).toBe(false);
  });

  it("アニメーションスタイルを返す", () => {
    const { result } = renderHook(() => useFloatingSearch());
    expect(result.current.fabAnimatedStyle).toBeDefined();
    expect(result.current.iconAnimatedStyle).toBeDefined();
    expect(result.current.inputAnimatedStyle).toBeDefined();
  });
});
