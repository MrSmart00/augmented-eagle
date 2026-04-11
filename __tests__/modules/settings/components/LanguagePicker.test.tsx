import { render, screen, fireEvent } from "@testing-library/react-native";
import { LanguagePicker } from "@/src/modules/settings/components/LanguagePicker";

const mockChangeLanguage = jest.fn();
let mockLanguage = "ja";

jest.mock("@/src/shared", () => ({
  useLanguage: () => ({
    language: mockLanguage,
    changeLanguage: mockChangeLanguage,
  }),
}));

describe("LanguagePicker", () => {
  beforeEach(() => {
    mockLanguage = "ja";
    mockChangeLanguage.mockReset();
  });

  it("日本語と英語の選択肢が表示される", () => {
    render(<LanguagePicker />);

    expect(screen.getByTestId("language-option-ja")).toBeTruthy();
    expect(screen.getByTestId("language-option-en")).toBeTruthy();
  });

  it("現在の言語にチェックマークが表示される", () => {
    render(<LanguagePicker />);

    expect(screen.getByTestId("checkmark-ja")).toBeTruthy();
    expect(screen.queryByTestId("checkmark-en")).toBeNull();
  });

  it("言語を選択するとchangeLanguageが呼ばれる", () => {
    render(<LanguagePicker />);

    fireEvent.press(screen.getByTestId("language-option-en"));

    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });
});
