import { render, screen, fireEvent } from "@testing-library/react-native";
import { HomeScreen } from "@/src/modules/home";
import { FavoritesProvider } from "@/src/shared";

jest.mock("expo-router", () => ({
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
    asChild?: boolean;
  }) => {
    const { View } = require("react-native");
    return <View testID={`link-${href}`}>{children}</View>;
  },
}));

const renderWithProvider = () =>
  render(
    <FavoritesProvider>
      <HomeScreen />
    </FavoritesProvider>,
  );

describe("HomeScreen", () => {
  it("ポケモンカードが表示される", () => {
    renderWithProvider();
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
    expect(screen.getByText("フシギダネ")).toBeTruthy();
  });

  it("各カードが詳細画面へのリンクを持つ", () => {
    renderWithProvider();
    expect(screen.getByTestId("link-/detail/25")).toBeTruthy();
    expect(screen.getByTestId("link-/detail/1")).toBeTruthy();
  });

  it("検索入力フィールドが表示される", () => {
    renderWithProvider();
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  it("検索テキスト入力でポケモンがフィルタリングされる", () => {
    renderWithProvider();
    fireEvent.changeText(screen.getByTestId("search-input"), "ピカ");
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
    expect(screen.queryByText("フシギダネ")).toBeNull();
  });

  it("各カードにお気に入りボタンが表示される", () => {
    renderWithProvider();
    const buttons = screen.getAllByTestId("favorite-button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
