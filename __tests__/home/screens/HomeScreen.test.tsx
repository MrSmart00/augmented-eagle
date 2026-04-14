import { render, screen, fireEvent } from "@testing-library/react-native";
import { HomeScreen } from "@/src/home";
import type { PokemonSummary } from "@/src/shared";

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

const renderWithProvider = () => render(<HomeScreen />);

describe("HomeScreen", () => {
  beforeEach(() => {
    mockUsePokemonList.pokemon = mockPokemon;
    mockUsePokemonList.isLoading = false;
    mockUsePokemonList.isLoadingMore = false;
    mockUsePokemonList.isRefreshing = false;
    mockUsePokemonList.hasMore = true;
    mockUsePokemonList.error = null;
    mockUsePokemonList.loadMore = jest.fn();
    mockUsePokemonList.refresh = jest.fn();
  });

  it("ポケモンカードが表示される", () => {
    renderWithProvider();
    expect(screen.getByText("Pikachu")).toBeTruthy();
    expect(screen.getByText("Bulbasaur")).toBeTruthy();
  });

  it("各カードが詳細画面へのリンクを持つ", () => {
    renderWithProvider();
    expect(screen.getByTestId("link-/detail/25")).toBeTruthy();
    expect(screen.getByTestId("link-/detail/1")).toBeTruthy();
  });

  it("FABボタンが表示される", () => {
    renderWithProvider();
    expect(screen.getByTestId("floating-search-fab")).toBeTruthy();
  });

  it("FABをタップすると検索入力フィールドが表示される", () => {
    renderWithProvider();
    fireEvent.press(screen.getByTestId("floating-search-fab"));
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  it("検索テキスト入力でポケモンがフィルタリングされる", () => {
    renderWithProvider();
    fireEvent.press(screen.getByTestId("floating-search-fab"));
    fireEvent.changeText(screen.getByTestId("search-input"), "Pika");
    expect(screen.getByText("Pikachu")).toBeTruthy();
    expect(screen.queryByText("Bulbasaur")).toBeNull();
  });

  it("各カードにお気に入りボタンが表示される", () => {
    renderWithProvider();
    const buttons = screen.getAllByTestId("favorite-button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("ローディング中にActivityIndicatorが表示される", () => {
    mockUsePokemonList.isLoading = true;
    renderWithProvider();
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("エラー時にエラーメッセージが表示される", () => {
    mockUsePokemonList.isLoading = false;
    mockUsePokemonList.error = "Network error";
    mockUsePokemonList.pokemon = [];
    renderWithProvider();
    expect(screen.getByTestId("error-text")).toBeTruthy();
  });
});
