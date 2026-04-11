import { render, screen, fireEvent } from "@testing-library/react-native";
import { PokemonCard } from "@/src/shared";
import type { Pokemon } from "@/src/shared";

const mockPokemon: Pokemon = {
  id: 25,
  name: "ピカチュウ",
  types: ["electric"],
};

const mockMultiTypePokemon: Pokemon = {
  id: 6,
  name: "リザードン",
  types: ["fire", "flying"],
};

describe("PokemonCard", () => {
  it("ポケモンの名前が表示される", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
  });

  it("ポケモンの画像が正しいURLで表示される", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    const image = screen.getByTestId("pokemon-image");
    expect(image.props.source.uri).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
    );
  });

  it("タイプバッジが表示される", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.getByText("electric")).toBeTruthy();
  });

  it("複数タイプの場合、全てのバッジが表示される", () => {
    render(<PokemonCard pokemon={mockMultiTypePokemon} />);
    expect(screen.getByText("fire")).toBeTruthy();
    expect(screen.getByText("flying")).toBeTruthy();
  });

  it("onPressコールバックが呼ばれる", () => {
    const onPress = jest.fn();
    render(<PokemonCard pokemon={mockPokemon} onPress={onPress} />);
    fireEvent.press(screen.getByTestId("pokemon-card"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("onPressが未指定の場合でもエラーにならない", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(() => {
      fireEvent.press(screen.getByTestId("pokemon-card"));
    }).not.toThrow();
  });

  it("isFavoriteとonToggleFavoriteが渡された場合、お気に入りボタンが表示される", () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={jest.fn()}
      />,
    );
    expect(screen.getByTestId("favorite-button")).toBeTruthy();
  });

  it("isFavoriteがtrueの場合、塗りつぶしハートが表示される", () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={true}
        onToggleFavorite={jest.fn()}
      />,
    );
    expect(screen.getByText("♥")).toBeTruthy();
  });

  it("お気に入りボタン押下でonToggleFavoriteが呼ばれる", () => {
    const onToggleFavorite = jest.fn();
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />,
    );
    fireEvent.press(screen.getByTestId("favorite-button"));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it("isFavoriteが未指定の場合、お気に入りボタンが表示されない", () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    expect(screen.queryByTestId("favorite-button")).toBeNull();
  });
});
