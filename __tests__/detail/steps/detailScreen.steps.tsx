import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react-native";
import { DetailScreen } from "@/src/detail";
import type { Pokemon } from "@/src/shared";

const feature = loadFeature(
  "__tests__/detail/features/detailScreen.feature"
);

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

jest.mock("@/src/detail/hooks/usePokemonDetail", () => ({
  usePokemonDetail: () => mockUsePokemonDetail,
}));

jest.mock("@/src/detail/hooks/usePokemonSpeciesInfo", () => ({
  usePokemonSpeciesInfo: () => mockUsePokemonSpeciesInfo,
}));

const renderWithProvider = (id: string) => render(<DetailScreen id={id} />);

defineFeature(feature, (test) => {
  beforeEach(() => {
    mockUsePokemonDetail.pokemon = mockPokemon;
    mockUsePokemonDetail.isLoading = false;
    mockUsePokemonDetail.error = null;
    mockUsePokemonSpeciesInfo.flavorText = "It keeps its tail raised.";
    mockUsePokemonSpeciesInfo.localizedName = "ピカチュウ";
    mockUsePokemonSpeciesInfo.isLoading = false;
  });

  test("ローカライズされたポケモン名が表示される", ({ given, when, then }) => {
    given("ピカチュウの詳細データとローカライズ名がモックされている", () => {
      // defaults from beforeEach
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ポケモンのIDが表示される", ({ given, when, then }) => {
    given("ピカチュウの詳細データとローカライズ名がモックされている", () => {
      // defaults from beforeEach
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ローディング中にActivityIndicatorが表示される", ({ given, when, then }) => {
    given("ローディング中のモック状態が設定されている", () => {
      mockUsePokemonDetail.isLoading = true;
      mockUsePokemonDetail.pokemon = null;
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then("ローディングインジケータが表示される", () => {
      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  test("エラー時にエラーメッセージが表示される", ({ given, when, then }) => {
    given("エラー状態のモックが設定されている", () => {
      mockUsePokemonDetail.pokemon = null;
      mockUsePokemonDetail.error = "Not found";
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("お気に入りボタンが表示される", ({ given, when, then }) => {
    given("ピカチュウの詳細データとローカライズ名がモックされている", () => {
      // defaults from beforeEach
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then("お気に入りボタンが表示される", () => {
      expect(screen.getByTestId("favorite-button")).toBeTruthy();
    });
  });

  test("ステータスが詳細画面に表示される", ({ given, when, then }) => {
    given("ピカチュウの詳細データとローカライズ名がモックされている", () => {
      // defaults from beforeEach
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("身長と体重が詳細画面に表示される", ({ given, when, then, and }) => {
    given("ピカチュウの詳細データとローカライズ名がモックされている", () => {
      // defaults from beforeEach
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("フレーバーテキストが表示される", ({ given, when, then }) => {
    given("ピカチュウの詳細データとローカライズ名がモックされている", () => {
      // defaults from beforeEach
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ローカライズ名がnullの場合はAPI名が表示される", ({ given, when, then }) => {
    given("ローカライズ名がnullのモック状態が設定されている", () => {
      mockUsePokemonSpeciesInfo.localizedName = null;
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });
});
