import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { Keyboard, Platform } from "react-native";
import { FloatingSearchButton } from "@/src/home";

const feature = loadFeature(
  "__tests__/home/features/floatingSearchButton.feature"
);

defineFeature(feature, (test) => {
  let onChangeText: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    onChangeText = jest.fn();
  });

  const defaultProps = {
    searchText: "",
    onChangeText: jest.fn(),
    placeholder: "Search...",
  };

  test("FABボタンが表示される", ({ given, then }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      render(<FloatingSearchButton {...defaultProps} />);
    });

    then("FABボタンが表示される", () => {
      expect(screen.getByTestId("floating-search-fab")).toBeTruthy();
    });
  });

  test("FABをタップすると検索入力が表示される", ({ given, when, then }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      render(<FloatingSearchButton {...defaultProps} />);
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    then("検索入力フィールドが表示される", () => {
      expect(screen.getByTestId("search-input")).toBeTruthy();
    });
  });

  test("検索入力にテキストを入力するとonChangeTextが呼ばれる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      onChangeText = jest.fn();
      render(
        <FloatingSearchButton
          {...defaultProps}
          onChangeText={onChangeText}
        />
      );
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    and(/^検索入力に "(.*)" と入力する$/, (text: string) => {
      fireEvent.changeText(screen.getByTestId("search-input"), text);
    });

    then(/^onChangeTextが "(.*)" で呼ばれる$/, (expected: string) => {
      expect(onChangeText).toHaveBeenCalledWith(expected);
    });
  });

  test("閉じるボタンをタップすると折りたたまれテキストがクリアされる", ({
    given,
    when,
    then,
    and,
  }) => {
    given(
      /^検索テキスト "(.*)" でFloatingSearchButtonがレンダリングされている$/,
      (searchText: string) => {
        onChangeText = jest.fn();
        render(
          <FloatingSearchButton
            {...defaultProps}
            searchText={searchText}
            onChangeText={onChangeText}
          />
        );
      }
    );

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    and("閉じるボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("search-close-button"));
    });

    then(/^onChangeTextが "(.*)" で呼ばれる$/, (expected: string) => {
      expect(onChangeText).toHaveBeenCalledWith(expected);
    });
  });

  test("プレースホルダーが表示される", ({ given, when, then }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      render(<FloatingSearchButton {...defaultProps} />);
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    then(/^プレースホルダー "(.*)" が表示される$/, (placeholder: string) => {
      expect(screen.getByPlaceholderText(placeholder)).toBeTruthy();
    });
  });

  test("キーボードが閉じたらFABボタンに戻る", ({
    given,
    when,
    then,
    and,
  }) => {
    let hideCallback: (() => void) | undefined;
    let addListenerSpy: jest.SpyInstance;

    given("FloatingSearchButtonがレンダリングされている", () => {
      onChangeText = jest.fn();
      const hideEvent =
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      addListenerSpy = jest.spyOn(Keyboard, "addListener");
      addListenerSpy.mockImplementation((event, callback) => {
        if (event === hideEvent) {
          hideCallback = callback as () => void;
        }
        return { remove: jest.fn() } as unknown as ReturnType<
          typeof Keyboard.addListener
        >;
      });

      render(
        <FloatingSearchButton
          {...defaultProps}
          onChangeText={onChangeText}
        />
      );
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
      expect(screen.getByTestId("search-input")).toBeTruthy();
    });

    and("キーボードが閉じられる", () => {
      act(() => {
        hideCallback?.();
      });
    });

    then(/^onChangeTextが "(.*)" で呼ばれる$/, (expected: string) => {
      expect(onChangeText).toHaveBeenCalledWith(expected);
    });

    and("FABボタンが表示される", () => {
      expect(screen.getByTestId("floating-search-fab")).toBeTruthy();
      addListenerSpy.mockRestore();
    });
  });
});
