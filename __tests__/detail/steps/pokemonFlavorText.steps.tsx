import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react-native";
import { PokemonFlavorText } from "@/src/detail/components/PokemonFlavorText";

const feature = loadFeature(
  "__tests__/detail/features/pokemonFlavorText.feature"
);

defineFeature(feature, (test) => {
  let text: string | null;
  let isLoading: boolean;
  let renderResult: ReturnType<typeof render> | null;

  test("フレーバーテキストが表示される", ({ given, when, then }) => {
    given("フレーバーテキストが与えられている", () => {
      text = "でんきを　ためこむ　せいしつ。";
      isLoading = false;
    });

    when("PokemonFlavorTextをレンダリングする", () => {
      render(<PokemonFlavorText text={text} />);
    });

    then(/^テキスト「(.*)」が表示される$/, (expected: string) => {
      expect(screen.getByText(expected)).toBeTruthy();
    });
  });

  test("ローディング中にインジケータが表示される", ({ given, when, then }) => {
    given("テキストがnullでローディング中である", () => {
      text = null;
      isLoading = true;
    });

    when("PokemonFlavorTextをレンダリングする", () => {
      render(<PokemonFlavorText text={text} isLoading={isLoading} />);
    });

    then("ローディングインジケータが表示される", () => {
      expect(screen.getByTestId("flavor-text-loading")).toBeTruthy();
    });
  });

  test("テキストがnullでローディングでない場合は何も表示されない", ({ given, when, then }) => {
    given("テキストがnullでローディングでない", () => {
      text = null;
      isLoading = false;
    });

    when("PokemonFlavorTextをレンダリングする", () => {
      renderResult = render(<PokemonFlavorText text={text} isLoading={isLoading} />);
    });

    then("何も表示されない", () => {
      expect(renderResult!.toJSON()).toBeNull();
    });
  });
});
