import { defineFeature, loadFeature } from "jest-cucumber";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react-native";
import { Keyboard, Platform } from "react-native";
import {
  FloatingSearchButton,
  HomeScreen,
} from "@/src/home";
import { PokemonCard } from "@/src/shared";
import type { PokemonSummary } from "@/src/shared";

// --- jest.mock (トップレベル) ---

const mockHomeScreenPokemon: PokemonSummary[] = [
  { id: 1, name: "Bulbasaur", types: [] },
  { id: 4, name: "Charmander", types: [] },
  { id: 25, name: "Pikachu", types: [] },
];

const mockUsePokemonList = {
  pokemon: mockHomeScreenPokemon,
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

jest.mock("@/src/home/repository/pokemonGraphqlApi");

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

// --- テストデータ ---

const mockCardPokemon: PokemonSummary = {
  id: 25,
  name: "ピカチュウ",
  types: ["electric"],
};

const mockMultiTypePokemon: PokemonSummary = {
  id: 6,
  name: "リザードン",
  types: ["fire", "flying"],
};

const resetMockState = () => {
  mockUsePokemonList.pokemon = mockHomeScreenPokemon;
  mockUsePokemonList.isLoading = false;
  mockUsePokemonList.isLoadingMore = false;
  mockUsePokemonList.isRefreshing = false;
  mockUsePokemonList.hasMore = true;
  mockUsePokemonList.error = null;
  mockUsePokemonList.loadMore = jest.fn();
  mockUsePokemonList.refresh = jest.fn();
};

// --- Feature定義 ---

const feature = loadFeature("__tests__/home/screens/homeScreen.feature");

defineFeature(feature, (test) => {
  // --- ポケモンカード ---

  let cardPokemon: PokemonSummary;
  let cardOnPress: jest.Mock;
  let cardOnToggleFavorite: jest.Mock;

  beforeEach(() => {
    resetMockState();
  });

  test("ポケモンの名前が表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={cardPokemon} />);
    });

    then(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ポケモンの画像が正しいURLで表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={cardPokemon} />);
    });

    then(/^画像URLが "(.*)" である$/, (url: string) => {
      const image = screen.getByTestId("pokemon-image");
      expect(image.props.source.uri).toBe(url);
    });
  });

  test("タイプバッジが翻訳されて表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={cardPokemon} />);
    });

    then(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("複数タイプの場合、全てのバッジが翻訳されて表示される", ({
    given,
    when,
    then,
    and,
  }) => {
    given("リザードンのデータが用意されている", () => {
      cardPokemon = mockMultiTypePokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={cardPokemon} />);
    });

    then(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^"(.*)" が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("onPressコールバックが呼ばれる", ({ given, when, then, and }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("onPress付きでPokemonCardを描画する", () => {
      cardOnPress = jest.fn();
      render(<PokemonCard pokemon={cardPokemon} onPress={cardOnPress} />);
    });

    and("カードを押す", () => {
      fireEvent.press(screen.getByTestId("pokemon-card"));
    });

    then("onPressが1回呼ばれる", () => {
      expect(cardOnPress).toHaveBeenCalledTimes(1);
    });
  });

  test("onPressが未指定の場合でもエラーにならない", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={cardPokemon} />);
    });

    then("カードを押してもエラーにならない", () => {
      expect(() => {
        fireEvent.press(screen.getByTestId("pokemon-card"));
      }).not.toThrow();
    });
  });

  test("isFavoriteとonToggleFavoriteが渡された場合、お気に入りボタンが表示される", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("お気に入り機能付きでPokemonCardを描画する", () => {
      cardOnToggleFavorite = jest.fn();
      render(
        <PokemonCard
          pokemon={cardPokemon}
          isFavorite={false}
          onToggleFavorite={cardOnToggleFavorite}
        />
      );
    });

    then("お気に入りボタンが表示される", () => {
      expect(screen.getByTestId("favorite-button")).toBeTruthy();
    });
  });

  test("isFavoriteがtrueの場合、Lottieアニメーションが表示される", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("お気に入り状態でPokemonCardを描画する", () => {
      cardOnToggleFavorite = jest.fn();
      render(
        <PokemonCard
          pokemon={cardPokemon}
          isFavorite={true}
          onToggleFavorite={cardOnToggleFavorite}
        />
      );
    });

    then("Lottieアニメーションが表示される", () => {
      expect(screen.getByTestId("favorite-lottie")).toBeTruthy();
    });
  });

  test("お気に入りボタン押下後アニメーション完了でonToggleFavoriteが呼ばれる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("お気に入り機能付きでPokemonCardを描画する", () => {
      cardOnToggleFavorite = jest.fn();
      render(
        <PokemonCard
          pokemon={cardPokemon}
          isFavorite={false}
          onToggleFavorite={cardOnToggleFavorite}
        />
      );
    });

    and("お気に入りボタンを押す", () => {
      fireEvent.press(screen.getByTestId("favorite-button"));
    });

    then("onToggleFavoriteが1回呼ばれる", () => {
      expect(cardOnToggleFavorite).toHaveBeenCalledTimes(1);
    });
  });

  test("isFavoriteが未指定の場合、お気に入りボタンが表示されない", ({
    given,
    when,
    then,
  }) => {
    given("ピカチュウのデータが用意されている", () => {
      cardPokemon = mockCardPokemon;
    });

    when("PokemonCardを描画する", () => {
      render(<PokemonCard pokemon={cardPokemon} />);
    });

    then("お気に入りボタンが表示されない", () => {
      expect(screen.queryByTestId("favorite-button")).toBeNull();
    });
  });

  // --- フローティング検索ボタン ---

  let fabOnChangeText: jest.Mock;

  const defaultFabProps = {
    searchText: "",
    onChangeText: jest.fn(),
    placeholder: "Search...",
  };

  test("FloatingSearchButtonのFABボタンが表示される", ({ given, then }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      render(<FloatingSearchButton {...defaultFabProps} />);
    });

    then("FABボタンが表示される", () => {
      expect(screen.getByTestId("floating-search-fab")).toBeTruthy();
    });
  });

  test("FABをタップすると検索入力が表示される", ({ given, when, then }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      render(<FloatingSearchButton {...defaultFabProps} />);
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    then("検索入力フィールドが表示される", () => {
      expect(screen.getByTestId("search-input")).toBeTruthy();
    });
  });

  test("検索入力にテキストを入力するとonChangeTextが呼ばれる", ({
    given,
    when,
    then,
    and,
  }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      fabOnChangeText = jest.fn();
      render(
        <FloatingSearchButton
          {...defaultFabProps}
          onChangeText={fabOnChangeText}
        />
      );
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    and(/^検索入力に "(.*)" と入力する$/, (text: string) => {
      fireEvent.changeText(screen.getByTestId("search-input"), text);
    });

    then(/^onChangeTextが "(.*)" で呼ばれる$/, (expected: string) => {
      expect(fabOnChangeText).toHaveBeenCalledWith(expected);
    });
  });

  test("閉じるボタンをタップすると折りたたまれテキストがクリアされる", ({
    given,
    when,
    then,
    and,
  }) => {
    given(
      /^検索テキスト "(.*)" でFloatingSearchButtonがレンダリングされている$/,
      (searchText: string) => {
        fabOnChangeText = jest.fn();
        render(
          <FloatingSearchButton
            {...defaultFabProps}
            searchText={searchText}
            onChangeText={fabOnChangeText}
          />
        );
      }
    );

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    and("閉じるボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("search-close-button"));
    });

    then(/^onChangeTextが "(.*)" で呼ばれる$/, (expected: string) => {
      expect(fabOnChangeText).toHaveBeenCalledWith(expected);
    });
  });

  test("プレースホルダーが表示される", ({ given, when, then }) => {
    given("FloatingSearchButtonがレンダリングされている", () => {
      render(<FloatingSearchButton {...defaultFabProps} />);
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
    });

    then(/^プレースホルダー "(.*)" が表示される$/, (placeholder: string) => {
      expect(screen.getByPlaceholderText(placeholder)).toBeTruthy();
    });
  });

  test("キーボードが閉じたらFABボタンに戻る", ({
    given,
    when,
    then,
    and,
  }) => {
    let hideCallback: (() => void) | undefined;
    let addListenerSpy: jest.SpyInstance;

    given("FloatingSearchButtonがレンダリングされている", () => {
      fabOnChangeText = jest.fn();
      const hideEvent =
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      addListenerSpy = jest.spyOn(Keyboard, "addListener");
      addListenerSpy.mockImplementation((event, callback) => {
        if (event === hideEvent) {
          hideCallback = callback as () => void;
        }
        return { remove: jest.fn() } as unknown as ReturnType<
          typeof Keyboard.addListener
        >;
      });

      render(
        <FloatingSearchButton
          {...defaultFabProps}
          onChangeText={fabOnChangeText}
        />
      );
    });

    when("FABボタンをタップする", () => {
      fireEvent.press(screen.getByTestId("floating-search-fab"));
      expect(screen.getByTestId("search-input")).toBeTruthy();
    });

    and("キーボードが閉じられる", () => {
      const { act } = require("@testing-library/react-native");
      act(() => {
        hideCallback?.();
      });
    });

    then(/^onChangeTextが "(.*)" で呼ばれる$/, (expected: string) => {
      expect(fabOnChangeText).toHaveBeenCalledWith(expected);
    });

    and("FABボタンが表示される", () => {
      expect(screen.getByTestId("floating-search-fab")).toBeTruthy();
      addListenerSpy.mockRestore();
    });
  });

  // --- ホーム画面統合 ---

  test("ホーム画面にポケモンカードが表示される", ({ given, when, then, and }) => {
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

  test("ホーム画面にFABボタンが表示される", ({ given, when, then }) => {
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

  test("ホーム画面でFABをタップすると検索入力フィールドが表示される", ({
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
