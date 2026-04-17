import { defineFeature, loadFeature } from "jest-cucumber";
import { renderHook, act } from "@testing-library/react-native";
import { useFloatingSearch } from "@/src/home";

const feature = loadFeature(
  "__tests__/home/features/useFloatingSearch.feature"
);

defineFeature(feature, (test) => {
  let result: { current: ReturnType<typeof useFloatingSearch> };

  test("初期状態でisExpandedがfalse", ({ given, then }) => {
    given("useFloatingSearchフックがレンダリングされている", () => {
      const hook = renderHook(() => useFloatingSearch());
      result = hook.result;
    });

    then("isExpandedはfalseである", () => {
      expect(result.current.isExpanded).toBe(false);
    });
  });

  test("toggle()で展開状態が切り替わる", ({ given, when, then }) => {
    given("useFloatingSearchフックがレンダリングされている", () => {
      const hook = renderHook(() => useFloatingSearch());
      result = hook.result;
    });

    when("toggleを実行する", () => {
      act(() => {
        result.current.toggle();
      });
    });

    then("isExpandedはtrueである", () => {
      expect(result.current.isExpanded).toBe(true);
    });

    when("toggleを再度実行する", () => {
      act(() => {
        result.current.toggle();
      });
    });

    then("isExpandedはfalseである", () => {
      expect(result.current.isExpanded).toBe(false);
    });
  });

  test("close()で常に折りたたまれる", ({ given, when, then, and }) => {
    given("useFloatingSearchフックがレンダリングされている", () => {
      const hook = renderHook(() => useFloatingSearch());
      result = hook.result;
    });

    when("toggleを実行する", () => {
      act(() => {
        result.current.toggle();
      });
    });

    and("closeを実行する", () => {
      act(() => {
        result.current.close();
      });
    });

    then("isExpandedはfalseである", () => {
      expect(result.current.isExpanded).toBe(false);
    });
  });

  test("close()は折りたたみ状態でも安全に呼べる", ({ given, when, then }) => {
    given("useFloatingSearchフックがレンダリングされている", () => {
      const hook = renderHook(() => useFloatingSearch());
      result = hook.result;
    });

    when("closeを実行する", () => {
      act(() => {
        result.current.close();
      });
    });

    then("isExpandedはfalseである", () => {
      expect(result.current.isExpanded).toBe(false);
    });
  });

  test("アニメーションスタイルを返す", ({ given, then, and }) => {
    given("useFloatingSearchフックがレンダリングされている", () => {
      const hook = renderHook(() => useFloatingSearch());
      result = hook.result;
    });

    then("fabAnimatedStyleが定義されている", () => {
      expect(result.current.fabAnimatedStyle).toBeDefined();
    });

    and("iconAnimatedStyleが定義されている", () => {
      expect(result.current.iconAnimatedStyle).toBeDefined();
    });

    and("inputAnimatedStyleが定義されている", () => {
      expect(result.current.inputAnimatedStyle).toBeDefined();
    });
  });
});
