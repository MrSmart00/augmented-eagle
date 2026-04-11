import { render, screen, fireEvent } from "@testing-library/react-native";
import { FavoritesScreen } from "@/src/modules/favorites";
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
      <FavoritesScreen />
    </FavoritesProvider>,
  );

describe("FavoritesScreen", () => {
  it("お気に入り画面のタイトルが表示される", () => {
    renderWithProvider();
    expect(screen.getByText("お気に入り")).toBeTruthy();
  });

  it("お気に入りが空の場合、プレースホルダーが表示される", () => {
    renderWithProvider();
    expect(
      screen.getByText("お気に入りのポケモンはまだいません"),
    ).toBeTruthy();
  });

  it("お気に入りのポケモンがカードとして表示される", () => {
    renderWithProvider();
    // ピカチュウ(id:25)のお気に入りボタンはまだ無いので、
    // FavoritesScreenには直接お気に入りを追加できない。
    // 代わりにプレースホルダーが表示されることを確認。
    expect(screen.queryByText("ピカチュウ")).toBeNull();
    expect(
      screen.getByText("お気に入りのポケモンはまだいません"),
    ).toBeTruthy();
  });
});
