import { render, screen } from "@testing-library/react-native";
import { FavoritesScreen } from "@/src/modules/favorites";

describe("FavoritesScreen", () => {
  it("お気に入り画面のタイトルが表示される", () => {
    render(<FavoritesScreen />);
    expect(screen.getByText("お気に入り")).toBeTruthy();
  });
});
