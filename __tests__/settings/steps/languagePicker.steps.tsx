import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { LanguagePicker } from "@/src/settings/components/LanguagePicker";

const mockChangeLanguage = jest.fn();
let mockLanguage = "ja";

jest.mock("@/src/shared", () => ({
  useLanguage: () => ({
    language: mockLanguage,
    changeLanguage: mockChangeLanguage,
  }),
}));

const feature = loadFeature(
  "__tests__/settings/features/languagePicker.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    mockLanguage = "ja";
    mockChangeLanguage.mockReset();
  });

  test("日本語と英語の選択肢が表示される", ({ given, when, then, and }) => {
    given(/^現在の言語が "ja" である$/, () => {
      mockLanguage = "ja";
    });

    when("言語選択コンポーネントを表示する", () => {
      render(<LanguagePicker />);
    });

    then("日本語の選択肢が表示される", () => {
      expect(screen.getByTestId("language-option-ja")).toBeTruthy();
    });

    and("英語の選択肢が表示される", () => {
      expect(screen.getByTestId("language-option-en")).toBeTruthy();
    });
  });

  test("現在の言語にチェックマークが表示される", ({ given, when, then, and }) => {
    given(/^現在の言語が "ja" である$/, () => {
      mockLanguage = "ja";
    });

    when("言語選択コンポーネントを表示する", () => {
      render(<LanguagePicker />);
    });

    then("日本語にチェックマークが表示される", () => {
      expect(screen.getByTestId("checkmark-ja")).toBeTruthy();
    });

    and("英語にチェックマークが表示されない", () => {
      expect(screen.queryByTestId("checkmark-en")).toBeNull();
    });
  });

  test("言語を選択するとchangeLanguageが呼ばれる", ({ given, when, then }) => {
    given(/^現在の言語が "ja" である$/, () => {
      mockLanguage = "ja";
    });

    when("英語の選択肢をタップする", () => {
      render(<LanguagePicker />);
      fireEvent.press(screen.getByTestId("language-option-en"));
    });

    then(/^changeLanguageが "en" で呼ばれる$/, () => {
      expect(mockChangeLanguage).toHaveBeenCalledWith("en");
    });
  });
});
