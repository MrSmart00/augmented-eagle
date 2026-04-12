import { render, screen, fireEvent } from "@testing-library/react-native";
import { FloatingSearchButton } from "@/src/modules/home/components/FloatingSearchButton";

describe("FloatingSearchButton", () => {
  const defaultProps = {
    searchText: "",
    onChangeText: jest.fn(),
    placeholder: "Search...",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("FABボタンが表示される", () => {
    render(<FloatingSearchButton {...defaultProps} />);
    expect(screen.getByTestId("floating-search-fab")).toBeTruthy();
  });

  it("FABをタップすると検索入力が表示される", () => {
    render(<FloatingSearchButton {...defaultProps} />);
    fireEvent.press(screen.getByTestId("floating-search-fab"));
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  it("検索入力にテキストを入力するとonChangeTextが呼ばれる", () => {
    const onChangeText = jest.fn();
    render(
      <FloatingSearchButton {...defaultProps} onChangeText={onChangeText} />,
    );
    fireEvent.press(screen.getByTestId("floating-search-fab"));
    fireEvent.changeText(screen.getByTestId("search-input"), "Pika");
    expect(onChangeText).toHaveBeenCalledWith("Pika");
  });

  it("閉じるボタンをタップすると折りたたまれテキストがクリアされる", () => {
    const onChangeText = jest.fn();
    render(
      <FloatingSearchButton
        {...defaultProps}
        searchText="Pika"
        onChangeText={onChangeText}
      />,
    );
    fireEvent.press(screen.getByTestId("floating-search-fab"));
    fireEvent.press(screen.getByTestId("search-close-button"));
    expect(onChangeText).toHaveBeenCalledWith("");
  });

  it("プレースホルダーが表示される", () => {
    render(<FloatingSearchButton {...defaultProps} />);
    fireEvent.press(screen.getByTestId("floating-search-fab"));
    expect(screen.getByPlaceholderText("Search...")).toBeTruthy();
  });
});
