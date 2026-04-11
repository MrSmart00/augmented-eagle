import { render, screen, fireEvent } from "@testing-library/react-native";
import { PokemonDetail } from "@/src/modules/detail/components/PokemonDetail";
import type { Pokemon } from "@/src/shared";

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

describe("PokemonDetail", () => {
  it("ローカライズ名が渡された場合に表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} localizedName="ピカチュウ" />);
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
  });

  it("ローカライズ名がnullの場合はAPI名が表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} localizedName={null} />);
    expect(screen.getByText("pikachu")).toBeTruthy();
  });

  it("ポケモンのIDが3桁ゼロ埋めで表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    expect(screen.getByText("#025")).toBeTruthy();
  });

  it("ポケモンの画像が表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    const image = screen.getByTestId("pokemon-detail-image");
    expect(image.props.source.uri).toContain("25.png");
  });

  it("タイプバッジが翻訳されて表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    expect(screen.getByText("types.electric")).toBeTruthy();
  });

  it("複数タイプが翻訳されて全て表示される", () => {
    render(<PokemonDetail pokemon={multiTypePokemon} />);
    expect(screen.getByText("types.fire")).toBeTruthy();
    expect(screen.getByText("types.flying")).toBeTruthy();
  });

  it("isFavoriteとonToggleFavoriteが渡された場合、お気に入りボタンが表示される", () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={jest.fn()}
      />,
    );
    expect(screen.getByTestId("favorite-button")).toBeTruthy();
  });

  it("お気に入りボタン押下でonToggleFavoriteが呼ばれる", () => {
    const onToggleFavorite = jest.fn();
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />,
    );
    fireEvent.press(screen.getByTestId("favorite-button"));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it("isFavoriteが未指定の場合、お気に入りボタンが表示されない", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    expect(screen.queryByTestId("favorite-button")).toBeNull();
  });

  it("フレーバーテキストが渡された場合に表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} flavorText="でんきを　ためこむ　せいしつ。" />);
    expect(screen.getByText("でんきを　ためこむ　せいしつ。")).toBeTruthy();
  });

  it("フレーバーテキストが未指定の場合は表示されない", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    expect(screen.queryByTestId("flavor-text-loading")).toBeNull();
  });
});
