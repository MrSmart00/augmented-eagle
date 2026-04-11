import { render, screen } from "@testing-library/react-native";
import { PokemonFlavorText } from "@/src/modules/detail/components/PokemonFlavorText";

describe("PokemonFlavorText", () => {
  it("フレーバーテキストが表示される", () => {
    render(<PokemonFlavorText text="でんきを　ためこむ　せいしつ。" />);
    expect(screen.getByText("でんきを　ためこむ　せいしつ。")).toBeTruthy();
  });

  it("ローディング中にインジケータが表示される", () => {
    render(<PokemonFlavorText text={null} isLoading={true} />);
    expect(screen.getByTestId("flavor-text-loading")).toBeTruthy();
  });

  it("テキストがnullでローディングでない場合は何も表示されない", () => {
    const { toJSON } = render(<PokemonFlavorText text={null} isLoading={false} />);
    expect(toJSON()).toBeNull();
  });
});
