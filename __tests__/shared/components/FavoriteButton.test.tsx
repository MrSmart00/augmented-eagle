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

  it("ボタン押下時にonToggleが即座に呼ばれる", () => {
    const onToggle = jest.fn();
    render(<FavoriteButton isFavorite={false} onToggle={onToggle} />);
    fireEvent.press(screen.getByTestId("favorite-button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("お気に入り状態の場合、ONの最終フレームで初期表示される", () => {
    render(<FavoriteButton isFavorite={true} onToggle={jest.fn()} />);
    const lottie = screen.getByTestId("favorite-lottie");
    expect(lottie.props.progress).toBeCloseTo(90 / 181);
  });

  it("非お気に入り状態の場合、progressが0で初期表示される", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    const lottie = screen.getByTestId("favorite-lottie");
    expect(lottie.props.progress).toBe(0);
  });

  it("外部からisFavoriteが変更された場合、progressが再同期される", () => {
    const { rerender } = render(
      <FavoriteButton isFavorite={false} onToggle={jest.fn()} />,
    );
    expect(screen.getByTestId("favorite-lottie").props.progress).toBe(0);
    rerender(<FavoriteButton isFavorite={true} onToggle={jest.fn()} />);
    expect(screen.getByTestId("favorite-lottie").props.progress).toBeCloseTo(
      90 / 181,
    );
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
