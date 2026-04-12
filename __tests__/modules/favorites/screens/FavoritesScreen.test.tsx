import { render, screen } from "@testing-library/react-native";
import { FavoritesScreen } from "@/src/modules/favorites";
import { FavoritesProvider } from "@/src/shared";
import type { PokemonSummary } from "@/src/shared";

const mockUsePokemonByIds = {
  pokemon: [] as PokemonSummary[],
  isLoading: false,
  error: null as string | null,
};

jest.mock("@/src/modules/favorites/hooks/usePokemonByIds", () => ({
  usePokemonByIds: () => mockUsePokemonByIds,
}));

jest.mock("expo-router", () => ({
  Link: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
    asChild?: boolean;
  }) => {
    const { View } = require("react-native");
    return <View testID={`link-${href}`}>{children}</View>;
  },
}));

const renderWithProvider = () =>
  render(
    <FavoritesProvider>
      <FavoritesScreen />
    </FavoritesProvider>,
  );

describe("FavoritesScreen", () => {
  beforeEach(() => {
    mockUsePokemonByIds.pokemon = [];
    mockUsePokemonByIds.isLoading = false;
    mockUsePokemonByIds.error = null;
  });

  it("お気に入りが空の場合、プレースホルダーが表示される", () => {
    renderWithProvider();
    expect(
      screen.getByText("favorites.empty"),
    ).toBeTruthy();
  });

  it("ローディング中にActivityIndicatorが表示される", () => {
    mockUsePokemonByIds.isLoading = true;
    renderWithProvider();
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("お気に入りのポケモンがカードとして表示される", () => {
    mockUsePokemonByIds.pokemon = [
      { id: 25, name: "Pikachu", types: ["electric"] },
    ];
    renderWithProvider();
    expect(screen.getByText("Pikachu")).toBeTruthy();
  });
});
