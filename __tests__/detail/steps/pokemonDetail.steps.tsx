import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { PokemonDetail } from "@/src/detail/components/PokemonDetail";
import type { Pokemon } from "@/src/shared";

const feature = loadFeature(
  "__tests__/detail/features/pokemonDetail.feature"
);

const mockPokemon: Pokemon = {
  id: 25,
  name: "pikachu",
  types: ["electric"],
  stats: [
    { name: "hp", baseStat: 35 },
    { name: "attack", baseStat: 55 },
    { name: "defense", baseStat: 40 },
    { name: "special-attack", baseStat: 50 },
    { name: "special-defense", baseStat: 50 },
    { name: "speed", baseStat: 90 },
  ],
  height: 4,
  weight: 60,
  abilities: [
    { name: "static", isHidden: false },
    { name: "lightning-rod", isHidden: true },
  ],
};

const multiTypePokemon: Pokemon = {
  id: 6,
  name: "charizard",
  types: ["fire", "flying"],
  stats: [
    { name: "hp", baseStat: 78 },
    { name: "attack", baseStat: 84 },
    { name: "defense", baseStat: 78 },
    { name: "special-attack", baseStat: 109 },
    { name: "special-defense", baseStat: 85 },
    { name: "speed", baseStat: 100 },
  ],
  height: 17,
  weight: 905,
  abilities: [
    { name: "blaze", isHidden: false },
    { name: "solar-power", isHidden: true },
  ],
};

defineFeature(feature, (test) => {
  let onToggleFavorite: jest.Mock;

  test("ローカライズ名が渡された場合に表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when(/^ローカライズ名「(.*)」を指定してPokemonDetailをレンダリングする$/, (name: string) => {
      render(<PokemonDetail pokemon={mockPokemon} localizedName={name} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ローカライズ名がnullの場合はAPI名が表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("ローカライズ名をnullにしてPokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemon} localizedName={null} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ポケモンのIDが3桁ゼロ埋めで表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemon} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ポケモンの画像が表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemon} />);
    });

    then(/^ポケモン画像のURIに「(.*)」が含まれる$/, (fragment: string) => {
      const image = screen.getByTestId("pokemon-detail-image");
      expect(image.props.source.uri).toContain(fragment);
    });
  });

  test("タイプバッジが翻訳されて表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemon} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("複数タイプが翻訳されて全て表示される", ({ given, when, then, and }) => {
    given("リザードンのデータが用意されている", () => {
      // multiTypePokemon is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={multiTypePokemon} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("お気に入りボタンが表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("お気に入り機能付きでPokemonDetailをレンダリングする", () => {
      render(
        <PokemonDetail
          pokemon={mockPokemon}
          isFavorite={false}
          onToggleFavorite={jest.fn()}
        />,
      );
    });

    then("お気に入りボタンが表示される", () => {
      expect(screen.getByTestId("favorite-button")).toBeTruthy();
    });
  });

  test("お気に入りボタン押下後にonToggleFavoriteが呼ばれる", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      onToggleFavorite = jest.fn();
    });

    when("お気に入り機能付きでPokemonDetailをレンダリングしてボタンを押す", () => {
      render(
        <PokemonDetail
          pokemon={mockPokemon}
          isFavorite={false}
          onToggleFavorite={onToggleFavorite}
        />,
      );
      fireEvent.press(screen.getByTestId("favorite-button"));
    });

    then("onToggleFavoriteが1回呼ばれる", () => {
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    });
  });

  test("お気に入りが未指定の場合ボタンが表示されない", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemon} />);
    });

    then("お気に入りボタンが表示されない", () => {
      expect(screen.queryByTestId("favorite-button")).toBeNull();
    });
  });

  test("フレーバーテキストが渡された場合に表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("フレーバーテキスト付きでPokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemon} flavorText="でんきを　ためこむ　せいしつ。" />);
    });

    then("フレーバーテキストが表示される", () => {
      expect(screen.getByText("でんきを　ためこむ　せいしつ。")).toBeTruthy();
    });
  });

  test("フレーバーテキストが未指定の場合は表示されない", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemon is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemon} />);
    });

    then("フレーバーテキストのローディングが表示されない", () => {
      expect(screen.queryByTestId("flavor-text-loading")).toBeNull();
    });
  });
});
