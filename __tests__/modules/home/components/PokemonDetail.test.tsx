import { render, screen } from "@testing-library/react-native";
import { PokemonDetail } from "@/src/modules/home";
import type { Pokemon } from "@/src/modules/home";

const mockPokemon: Pokemon = {
  id: 25,
  name: "ピカチュウ",
  types: ["electric"],
};

const multiTypePokemon: Pokemon = {
  id: 6,
  name: "リザードン",
  types: ["fire", "flying"],
};

describe("PokemonDetail", () => {
  it("ポケモンの名前が表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
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

  it("タイプバッジが表示される", () => {
    render(<PokemonDetail pokemon={mockPokemon} />);
    expect(screen.getByText("electric")).toBeTruthy();
  });

  it("複数タイプが全て表示される", () => {
    render(<PokemonDetail pokemon={multiTypePokemon} />);
    expect(screen.getByText("fire")).toBeTruthy();
    expect(screen.getByText("flying")).toBeTruthy();
  });
});
