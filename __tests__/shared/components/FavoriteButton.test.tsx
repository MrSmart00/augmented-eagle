import { render, screen, fireEvent } from "@testing-library/react-native";
import { FavoriteButton } from "@/src/shared";

const TOTAL_FRAMES = 181;
const ON_END = 90;
const OFF_END = 181;

describe("FavoriteButton", () => {
  it("Lottieアニメーションコンポーネントが描画される", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    expect(screen.getByTestId("favorite-lottie")).toBeTruthy();
  });

  it("お気に入り状態でONアニメーションの終了フレームが表示される", () => {
    render(<FavoriteButton isFavorite={true} onToggle={jest.fn()} />);
    const lottie = screen.getByTestId("favorite-lottie");
    expect(lottie.props.progress).toBeCloseTo(ON_END / TOTAL_FRAMES);
  });

  it("非お気に入り状態でOFFアニメーションの終了フレームが表示される", () => {
    render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} />);
    const lottie = screen.getByTestId("favorite-lottie");
    expect(lottie.props.progress).toBeCloseTo(OFF_END / TOTAL_FRAMES);
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
