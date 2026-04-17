import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { HomeScreen } from "@/src/home";
import type { PokemonSummary } from "@/src/shared";

const feature = loadFeature("__tests__/home/features/homeScreen.feature");

const mockPokemon: PokemonSummary[] = [
  { id: 1, name: "Bulbasaur", types: [] },
  { id: 4, name: "Charmander", types: [] },
  { id: 25, name: "Pikachu", types: [] },
];

const mockUsePokemonList = {
  pokemon: mockPokemon,
  isLoading: false,
  isLoadingMore: false,
  isRefreshing: false,
  hasMore: true,
  error: null as string | null,
  loadMore: jest.fn(),
  refresh: jest.fn(),
};

jest.mock("@/src/home/hooks/usePokemonList", () => ({
  usePokemonList: () => mockUsePokemonList,
}));

jest.mock("@react-navigation/bottom-tabs", () => ({
  useBottomTabBarHeight: () => 49,
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

const resetMockState = () => {
  mockUsePokemonList.pokemon = mockPokemon;
  mockUsePokemonList.isLoading = false;
  mockUsePokemonList.isLoadingMore = false;
  mockUsePokemonList.isRefreshing = false;
  mockUsePokemonList.hasMore = true;
  mockUsePokemonList.error = null;
  mockUsePokemonList.loadMore = jest.fn();
  mockUsePokemonList.refresh = jest.fn();
};

defineFeature(feature, (test) => {
  beforeEach(() => {
    resetMockState();
  });

  test("ポケモンカードが表示される", ({ given, when, then, and }) => {
    given("ポケモンリストが正常にロードされている", () => {
      // Default mock state is already set
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    then(/^"(.*)" が表示される$/, (name: string) => {
      expect(screen.getByText(name)).toBeTruthy();
    });

    and(/^"(.*)" が表示される$/, (name: string) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  test("各カードが詳細画面へのリンクを持つ", ({ given, when, then, and }) => {
    given("ポケモンリストが正常にロードされている", () => {
      // Default mock state
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    then(/^ID (\d+) の詳細リンクが存在する$/, (id: string) => {
      expect(screen.getByTestId(`link-/detail/${id}`)).toBeTruthy();
    });

    and(/^ID (\d+) の詳細リンクが存在する$/, (id: string) => {
      expect(screen.getByTestId(`link-/detail/${id}`)).toBeTruthy();
    });
  });

  test("FABボタンが表示される", ({ given, when, then }) => {
    given("ポケモンリストが正常にロードされている", () => {
      // Default mock state
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    then("FABボタンが表示される", () => {
      expect(screen.getByTestId("floating-search-fab")).toBeTruthy();
    });
  });

  test("FABをタップすると検索入力フィールドが表示される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ポケモンリストが正常にロードされている", () => {
      // Default mock state
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    and("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    then("検索入力フィールドが表示される", () => {
      expect(screen.getByTestId("search-input")).toBeTruthy();
    });
  });

  test("検索テキスト入力でポケモンがフィルタリングされる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ポケモンリストが正常にロードされている", () => {
      // Default mock state
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    and("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    and(/^検索入力に "(.*)" と入力する$/, (text: string) => {
      fireEvent.changeText(screen.getByTestId("search-input"), text);
    });

    then(/^"(.*)" が表示される$/, (name: string) => {
      expect(screen.getByText(name)).toBeTruthy();
    });

    and(/^"(.*)" は表示されない$/, (name: string) => {
      expect(screen.queryByText(name)).toBeNull();
    });
  });

  test("各カードにお気に入りボタンが表示される", ({ given, when, then }) => {
    given("ポケモンリストが正常にロードされている", () => {
      // Default mock state
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    then("お気に入りボタンが表示される", () => {
      const buttons = screen.getAllByTestId("favorite-button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  test("ローディング中にActivityIndicatorが表示される", ({
    given,
    when,
    then,
  }) => {
    given("ポケモンリストがローディング中である", () => {
      mockUsePokemonList.isLoading = true;
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    then("ローディングインジケーターが表示される", () => {
      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  test("エラー時にエラーメッセージが表示される", ({ given, when, then }) => {
    given("ポケモンリストの取得でエラーが発生している", () => {
      mockUsePokemonList.isLoading = false;
      mockUsePokemonList.error = "Network error";
      mockUsePokemonList.pokemon = [];
    });

    when("ホーム画面をレンダリングする", () => {
      render(<HomeScreen />);
    });

    then("エラーメッセージが表示される", () => {
      expect(screen.getByTestId("error-text")).toBeTruthy();
    });
  });
});
