import { render, screen, fireEvent } from "@testing-library/react-native";
import { PokemonDetail } from "@/src/modules/detail/components/PokemonDetail";
import type { PokemonSummary } from "@/src/shared";

const mockPokemon: PokemonSummary = {
  id: 25,
  name: "ピカチュウ",
  types: ["electric"],
};

const multiTypePokemon: PokemonSummary = {
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
});
