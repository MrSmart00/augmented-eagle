import { render, screen } from "@testing-library/react-native";
import { DetailScreen } from "@/src/modules/detail";
import { FavoritesProvider } from "@/src/shared";

const renderWithProvider = (id: string) =>
  render(
    <FavoritesProvider>
      <DetailScreen id={id} />
    </FavoritesProvider>,
  );

describe("DetailScreen", () => {
  it("指定IDのポケモン詳細が表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
  });

  it("ポケモンのIDが表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("#025")).toBeTruthy();
  });

  it("存在しないIDの場合エラーメッセージが表示される", () => {
    renderWithProvider("999");
    expect(screen.getByText("ポケモンが見つかりません")).toBeTruthy();
  });

  it("お気に入りボタンが表示される", () => {
    renderWithProvider("25");
    expect(screen.getByTestId("favorite-button")).toBeTruthy();
  });
});
