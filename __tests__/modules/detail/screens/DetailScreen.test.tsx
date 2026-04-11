import { render, screen } from "@testing-library/react-native";
import { DetailScreen } from "@/src/modules/detail";
import { FavoritesProvider } from "@/src/shared";
import type { PokemonSummary } from "@/src/shared";

const mockPokemon: PokemonSummary = {
  id: 25,
  name: "Pikachu",
  types: ["electric"],
};

const mockUsePokemonById = {
  pokemon: mockPokemon as PokemonSummary | null,
  isLoading: false,
  error: null as string | null,
};

jest.mock("@/src/modules/detail/hooks/usePokemonDetail", () => ({
  usePokemonDetail: () => mockUsePokemonById,
}));

const renderWithProvider = (id: string) =>
  render(
    <FavoritesProvider>
      <DetailScreen id={id} />
    </FavoritesProvider>,
  );

describe("DetailScreen", () => {
  beforeEach(() => {
    mockUsePokemonById.pokemon = mockPokemon;
    mockUsePokemonById.isLoading = false;
    mockUsePokemonById.error = null;
  });

  it("指定IDのポケモン詳細が表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("Pikachu")).toBeTruthy();
  });

  it("ポケモンのIDが表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("#025")).toBeTruthy();
  });

  it("ローディング中にActivityIndicatorが表示される", () => {
    mockUsePokemonById.isLoading = true;
    mockUsePokemonById.pokemon = null;
    renderWithProvider("25");
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("エラー時にエラーメッセージが表示される", () => {
    mockUsePokemonById.pokemon = null;
    mockUsePokemonById.error = "Not found";
    renderWithProvider("999");
    expect(screen.getByText("ポケモンが見つかりません")).toBeTruthy();
  });

  it("お気に入りボタンが表示される", () => {
    renderWithProvider("25");
    expect(screen.getByTestId("favorite-button")).toBeTruthy();
  });
});
