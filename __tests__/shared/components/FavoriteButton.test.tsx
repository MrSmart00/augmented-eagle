import { render, screen, fireEvent } from "@testing-library/react-native";
import { FavoriteButton } from "@/src/shared";

describe("FavoriteButton", () => {
  it("Lottieアニメーションコンポーネントが描画される", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    expect(screen.getByTestId("favorite-lottie")).toBeTruthy();
  });

  it("autoPlayが無効になっている", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    const lottie = screen.getByTestId("favorite-lottie");
    expect(lottie.props.autoPlay).toBe(false);
  });

  it("ループが無効になっている", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    const lottie = screen.getByTestId("favorite-lottie");
    expect(lottie.props.loop).toBe(false);
  });

  it("アニメーション完了後にonToggleが呼ばれる", () => {
    const onToggle = jest.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    fireEvent.press(screen.getByTestId("favorite-button"));
    expect(onToggle).not.toHaveBeenCalled();
    const lottie = screen.getByTestId("favorite-lottie");
    lottie.props.onAnimationFinish(false);
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
