jest.unmock("react-i18next");

import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { LanguagePicker } from "@/src/settings/components/LanguagePicker";
import i18n, { initI18n } from "@/src/shared/i18n/i18n";

const feature = loadFeature(
  "__tests__/settings/screens/settingsScreen.feature"
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    if (i18n.isInitialized) {
      await i18n.changeLanguage("ja");
    }
  });

  test("日本語と英語の選択肢が表示される", ({ given, when, then, and }) => {
    given(/^現在の言語が "ja" である$/, async () => {
      await initI18n();
      await i18n.changeLanguage("ja");
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
    given(/^現在の言語が "ja" である$/, async () => {
      await initI18n();
      await i18n.changeLanguage("ja");
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
    given(/^現在の言語が "ja" である$/, async () => {
      await initI18n();
      await i18n.changeLanguage("ja");
    });

    when("英語の選択肢をタップする", () => {
      render(<LanguagePicker />);
      fireEvent.press(screen.getByTestId("language-option-en"));
    });

    then(/^changeLanguageが "en" で呼ばれる$/, () => {
      expect(i18n.language).toBe("en");
    });
  });
});
