import { render, screen, fireEvent } from "@testing-library/react-native";
import { FavoriteButton } from "@/src/shared";

describe("FavoriteButton", () => {
  it("お気に入り状態で塗りつぶしハートが表示される", () => {
    render(<FavoriteButton isFavorite={true} onToggle={jest.fn()} />);
    expect(screen.getByText("♥")).toBeTruthy();
  });

  it("非お気に入り状態でアウトラインハートが表示される", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    expect(screen.getByText("♡")).toBeTruthy();
  });

  it("ボタン押下でonToggleが呼ばれる", () => {
    const onToggle = jest.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    fireEvent.press(screen.getByTestId("favorite-button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("お気に入り状態のアクセシビリティラベルが正しい", () => {
    render(<FavoriteButton isFavorite={true} onToggle={jest.fn()} />);
    expect(screen.getByLabelText("favoriteButton.remove")).toBeTruthy();
  });

  it("非お気に入り状態のアクセシビリティラベルが正しい", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    expect(screen.getByLabelText("favoriteButton.add")).toBeTruthy();
  });
});
