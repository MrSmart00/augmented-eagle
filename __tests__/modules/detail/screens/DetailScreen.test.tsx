import { render, screen } from "@testing-library/react-native";
import { DetailScreen } from "@/src/modules/detail";
import { FavoritesProvider } from "@/src/shared";
import type { Pokemon } from "@/src/shared";

const mockPokemon: Pokemon = {
  id: 25,
  name: "Pikachu",
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

const mockUsePokemonDetail = {
  pokemon: mockPokemon as Pokemon | null,
  isLoading: false,
  error: null as string | null,
};

const mockUsePokemonSpeciesInfo = {
  flavorText: "It keeps its tail raised." as string | null,
  localizedName: "ピカチュウ" as string | null,
  isLoading: false,
};

jest.mock("@/src/modules/detail/hooks/usePokemonDetail", () => ({
  usePokemonDetail: () => mockUsePokemonDetail,
}));

jest.mock("@/src/modules/detail/hooks/usePokemonSpeciesInfo", () => ({
  usePokemonSpeciesInfo: () => mockUsePokemonSpeciesInfo,
}));

const renderWithProvider = (id: string) =>
  render(
    <FavoritesProvider>
      <DetailScreen id={id} />
    </FavoritesProvider>,
  );

describe("DetailScreen", () => {
  beforeEach(() => {
    mockUsePokemonDetail.pokemon = mockPokemon;
    mockUsePokemonDetail.isLoading = false;
    mockUsePokemonDetail.error = null;
    mockUsePokemonSpeciesInfo.flavorText = "It keeps its tail raised.";
    mockUsePokemonSpeciesInfo.localizedName = "ピカチュウ";
    mockUsePokemonSpeciesInfo.isLoading = false;
  });

  it("ローカライズされたポケモン名が表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("ピカチュウ")).toBeTruthy();
  });

  it("ポケモンのIDが表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("#025")).toBeTruthy();
  });

  it("ローディング中にActivityIndicatorが表示される", () => {
    mockUsePokemonDetail.isLoading = true;
    mockUsePokemonDetail.pokemon = null;
    renderWithProvider("25");
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("エラー時にエラーメッセージが表示される", () => {
    mockUsePokemonDetail.pokemon = null;
    mockUsePokemonDetail.error = "Not found";
    renderWithProvider("999");
    expect(screen.getByText("detail.notFound")).toBeTruthy();
  });

  it("お気に入りボタンが表示される", () => {
    renderWithProvider("25");
    expect(screen.getByTestId("favorite-button")).toBeTruthy();
  });

  it("ステータスが詳細画面に表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("detail.baseStats")).toBeTruthy();
  });

  it("身長と体重が詳細画面に表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("detail.height")).toBeTruthy();
    expect(screen.getByText("detail.weight")).toBeTruthy();
  });

  it("フレーバーテキストが表示される", () => {
    renderWithProvider("25");
    expect(screen.getByText("It keeps its tail raised.")).toBeTruthy();
  });

  it("ローカライズ名がnullの場合はAPI名が表示される", () => {
    mockUsePokemonSpeciesInfo.localizedName = null;
    renderWithProvider("25");
    expect(screen.getByText("Pikachu")).toBeTruthy();
  });
});
