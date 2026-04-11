import { render, screen, fireEvent } from "@testing-library/react-native";
import { PokemonCard } from "@/src/components/PokemonCard";
import type { Pokemon } from "@/src/types/pokemon";

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
});
