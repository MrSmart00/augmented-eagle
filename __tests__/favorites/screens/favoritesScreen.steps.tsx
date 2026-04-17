import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react-native";
import { FavoritesScreen } from "@/src/favorites";
import type { PokemonSummary } from "@/src/shared";

const mockUsePokemonByIdsReturn = {
  pokemon: [] as PokemonSummary[],
  isLoading: false,
  error: null as string | null,
};

jest.mock("@/src/favorites/hooks/usePokemonByIds", () => ({
  usePokemonByIds: jest.fn(() => mockUsePokemonByIdsReturn),
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

jest.mock("@/src/shared/i18n", () => ({
  i18n: {
    t: (key: string) => key,
  },
}));

const feature = loadFeature(
  "__tests__/favorites/screens/favoritesScreen.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    mockUsePokemonByIdsReturn.pokemon = [];
    mockUsePokemonByIdsReturn.isLoading = false;
    mockUsePokemonByIdsReturn.error = null;
  });

  test("お気に入りが空の場合、プレースホルダーが表示される", ({ given, when, then }) => {
    given("お気に入りポケモンがない", () => {
      // default state: empty
    });

    when("お気に入り画面を表示する", () => {
      render(<FavoritesScreen />);
    });

    then("プレースホルダーテキストが表示される", () => {
      expect(screen.getByText("favorites.empty")).toBeTruthy();
    });
  });

  test("ローディング中にActivityIndicatorが表示される", ({ given, when, then }) => {
    given("データをローディング中である", () => {
      mockUsePokemonByIdsReturn.isLoading = true;
    });

    when("お気に入り画面を表示する", () => {
      render(<FavoritesScreen />);
    });

    then("ローディングインジケーターが表示される", () => {
      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  test("お気に入りのポケモンがカードとして表示される", ({ given, when, then }) => {
    given("お気に入りにピカチュウが登録されている", () => {
      mockUsePokemonByIdsReturn.pokemon = [
        { id: 25, name: "Pikachu", types: ["electric"] },
      ];
    });

    when("お気に入り画面を表示する", () => {
      render(<FavoritesScreen />);
    });

    then(/^"Pikachu" のカードが表示される$/, () => {
      expect(screen.getByText("Pikachu")).toBeTruthy();
    });
  });
});
