import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { PokemonCard } from "@/src/shared";
import type { PokemonSummary } from "@/src/shared";

const feature = loadFeature(
  "__tests__/shared/features/pokemonCard.feature"
);

const mockPokemon: PokemonSummary = {
  id: 25,
  name: "ピカチュウ",
  types: ["electric"],
};

const mockMultiTypePokemon: PokemonSummary = {
  id: 6,
  name: "リザードン",
  types: ["fire", "flying"],
};

defineFeature(feature, (test) => {
  let pokemon: PokemonSummary;
  let onPress: jest.Mock;
  let onToggleFavorite: jest.Mock;

  test("ポケモンの名前が表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={pokemon} />);
    });

    then(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ポケモンの画像が正しいURLで表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={pokemon} />);
    });

    then(/^画像URLが "(.*)" である$/, (url: string) => {
      const image = screen.getByTestId("pokemon-image");
      expect(image.props.source.uri).toBe(url);
    });
  });

  test("タイプバッジが翻訳されて表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={pokemon} />);
    });

    then(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("複数タイプの場合、全てのバッジが翻訳されて表示される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("リザードンのデータが用意されている", () => {
      pokemon = mockMultiTypePokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={pokemon} />);
    });

    then(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("onPressコールバックが呼ばれる", ({ given, when, then, and }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("onPress付きでPokemonCardを描画する", () => {
      onPress = jest.fn();
      render(<PokemonCard pokemon={pokemon} onPress={onPress} />);
    });

    and("カードを押す", () => {
      fireEvent.press(screen.getByTestId("pokemon-card"));
    });

    then("onPressが1回呼ばれる", () => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  test("onPressが未指定の場合でもエラーにならない", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={pokemon} />);
    });

    then("カードを押してもエラーにならない", () => {
      expect(() => {
        fireEvent.press(screen.getByTestId("pokemon-card"));
      }).not.toThrow();
    });
  });

  test("isFavoriteとonToggleFavoriteが渡された場合、お気に入りボタンが表示される", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("お気に入り機能付きでPokemonCardを描画する", () => {
      onToggleFavorite = jest.fn();
      render(
        <PokemonCard
          pokemon={pokemon}
          isFavorite={false}
          onToggleFavorite={onToggleFavorite}
        />
      );
    });

    then("お気に入りボタンが表示される", () => {
      expect(screen.getByTestId("favorite-button")).toBeTruthy();
    });
  });

  test("isFavoriteがtrueの場合、Lottieアニメーションが表示される", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("お気に入り状態でPokemonCardを描画する", () => {
      onToggleFavorite = jest.fn();
      render(
        <PokemonCard
          pokemon={pokemon}
          isFavorite={true}
          onToggleFavorite={onToggleFavorite}
        />
      );
    });

    then("Lottieアニメーションが表示される", () => {
      expect(screen.getByTestId("favorite-lottie")).toBeTruthy();
    });
  });

  test("お気に入りボタン押下後アニメーション完了でonToggleFavoriteが呼ばれる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("お気に入り機能付きでPokemonCardを描画する", () => {
      onToggleFavorite = jest.fn();
      render(
        <PokemonCard
          pokemon={pokemon}
          isFavorite={false}
          onToggleFavorite={onToggleFavorite}
        />
      );
    });

    and("お気に入りボタンを押す", () => {
      fireEvent.press(screen.getByTestId("favorite-button"));
    });

    then("onToggleFavoriteが1回呼ばれる", () => {
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    });
  });

  test("isFavoriteが未指定の場合、お気に入りボタンが表示されない", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      pokemon = mockPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={pokemon} />);
    });

    then("お気に入りボタンが表示されない", () => {
      expect(screen.queryByTestId("favorite-button")).toBeNull();
    });
  });
});
