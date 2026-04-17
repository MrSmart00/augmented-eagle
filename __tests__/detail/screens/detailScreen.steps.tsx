import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { DetailScreen } from "@/src/detail";
import { PokemonDetail } from "@/src/detail/components/PokemonDetail";
import { PokemonAbilities } from "@/src/detail/components/PokemonAbilities";
import { PokemonFlavorText } from "@/src/detail/components/PokemonFlavorText";
import { PokemonPhysicalInfo } from "@/src/detail/components/PokemonPhysicalInfo";
import { PokemonStats } from "@/src/detail/components/PokemonStats";
import { StatBar } from "@/src/detail/components/StatBar";
import { usePokemonDetail } from "@/src/detail/hooks/usePokemonDetail";
import { usePokemonSpeciesInfo } from "@/src/detail/hooks/usePokemonSpeciesInfo";
import { FavoriteButton } from "@/src/shared";
import type { Pokemon, PokemonAbility, PokemonStat } from "@/src/shared";

// ============================================================
// jest.mock — ファイルトップレベル
// ============================================================

jest.mock("@/src/detail/repository/pokemonDetailApi");
jest.mock("@/src/detail/repository/pokemonSpeciesApi");

// DetailScreen用モック
const mockUsePokemonDetail = {
  pokemon: null as Pokemon | null,
  isLoading: false,
  error: null as string | null,
};

const mockUsePokemonSpeciesInfo = {
  flavorText: "It keeps its tail raised." as string | null,
  localizedName: "ピカチュウ" as string | null,
  isLoading: false,
};

jest.mock("@/src/detail/hooks/usePokemonDetail", () => ({
  usePokemonDetail: jest.fn(() => mockUsePokemonDetail),
}));

jest.mock("@/src/detail/hooks/usePokemonSpeciesInfo", () => ({
  usePokemonSpeciesInfo: jest.fn(() => mockUsePokemonSpeciesInfo),
}));

jest.mock("@/src/detail/hooks/usePokemonFlavorText", () => ({
  usePokemonFlavorText: jest.fn(),
}));

// ============================================================
// 共通テストデータ
// ============================================================

const mockPokemonForDetail: Pokemon = {
  id: 25,
  name: "pikachu",
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

const multiTypePokemon: Pokemon = {
  id: 6,
  name: "charizard",
  types: ["fire", "flying"],
  stats: [
    { name: "hp", baseStat: 78 },
    { name: "attack", baseStat: 84 },
    { name: "defense", baseStat: 78 },
    { name: "special-attack", baseStat: 109 },
    { name: "special-defense", baseStat: 85 },
    { name: "speed", baseStat: 100 },
  ],
  height: 17,
  weight: 905,
  abilities: [
    { name: "blaze", isHidden: false },
    { name: "solar-power", isHidden: true },
  ],
};

const mockScreenPokemon: Pokemon = {
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

const mockAbilities: PokemonAbility[] = [
  { name: "overgrow", isHidden: false },
  { name: "chlorophyll", isHidden: true },
];

const mockStats: PokemonStat[] = [
  { name: "hp", baseStat: 45 },
  { name: "attack", baseStat: 49 },
  { name: "defense", baseStat: 49 },
  { name: "special-attack", baseStat: 65 },
  { name: "special-defense", baseStat: 65 },
  { name: "speed", baseStat: 45 },
];

// ============================================================
// Feature 定義
// ============================================================

const feature = loadFeature(
  "__tests__/detail/screens/detailScreen.feature"
);

const renderWithProvider = (id: string) => render(<DetailScreen id={id} />);

defineFeature(feature, (test) => {
  // ============================================================
  // DetailScreen
  // ============================================================

  beforeEach(() => {
    mockUsePokemonDetail.pokemon = mockScreenPokemon;
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

  test("お気に入りボタンが詳細画面に表示される", ({ given, when, then }) => {
    given("ピカチュウの詳細データとローカライズ名がモックされている", () => {
      // defaults from beforeEach
    });

    when(/^詳細画面をID「(.*)」でレンダリングする$/, (id: string) => {
      renderWithProvider(id);
    });

    then("お気に入りボタンが詳細画面に表示される", () => {
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

    then(/^「(.*)」が詳細画面に表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が詳細画面に表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("フレーバーテキストが詳細画面に表示される", ({ given, when, then }) => {
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

  // ============================================================
  // PokemonDetailコンポーネント
  // ============================================================

  let onToggleFavorite: jest.Mock;

  test("ローカライズ名が渡された場合に表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when(/^ローカライズ名「(.*)」を指定してPokemonDetailをレンダリングする$/, (name: string) => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} localizedName={name} />);
    });

    then(/^PokemonDetailに「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ローカライズ名がnullの場合はPokemonDetailでAPI名が表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("ローカライズ名をnullにしてPokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} localizedName={null} />);
    });

    then(/^PokemonDetailに「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ポケモンのIDが3桁ゼロ埋めで表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} />);
    });

    then(/^PokemonDetailに「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("ポケモンの画像が表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} />);
    });

    then(/^ポケモン画像のURIに「(.*)」が含まれる$/, (fragment: string) => {
      const image = screen.getByTestId("pokemon-detail-image");
      expect(image.props.source.uri).toContain(fragment);
    });
  });

  test("タイプバッジが翻訳されて表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} />);
    });

    then(/^PokemonDetailに「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("複数タイプが翻訳されて全て表示される", ({ given, when, then, and }) => {
    given("リザードンのデータが用意されている", () => {
      // multiTypePokemon is predefined
    });

    when("PokemonDetailをリザードンでレンダリングする", () => {
      render(<PokemonDetail pokemon={multiTypePokemon} />);
    });

    then(/^PokemonDetailに「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^PokemonDetailに「(.*)」も表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("PokemonDetailにお気に入りボタンが表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("お気に入り機能付きでPokemonDetailをレンダリングする", () => {
      render(
        <PokemonDetail
          pokemon={mockPokemonForDetail}
          isFavorite={false}
          onToggleFavorite={jest.fn()}
        />,
      );
    });

    then("PokemonDetailのお気に入りボタンが表示される", () => {
      expect(screen.getByTestId("favorite-button")).toBeTruthy();
    });
  });

  test("お気に入りボタン押下後にonToggleFavoriteが呼ばれる", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      onToggleFavorite = jest.fn();
    });

    when("お気に入り機能付きでPokemonDetailをレンダリングしてボタンを押す", () => {
      render(
        <PokemonDetail
          pokemon={mockPokemonForDetail}
          isFavorite={false}
          onToggleFavorite={onToggleFavorite}
        />,
      );
      fireEvent.press(screen.getByTestId("favorite-button"));
    });

    then("onToggleFavoriteが1回呼ばれる", () => {
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    });
  });

  test("お気に入りが未指定の場合ボタンが表示されない", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} />);
    });

    then("PokemonDetailのお気に入りボタンが表示されない", () => {
      expect(screen.queryByTestId("favorite-button")).toBeNull();
    });
  });

  test("フレーバーテキストが渡された場合にPokemonDetailで表示される", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("フレーバーテキスト付きでPokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} flavorText="でんきを　ためこむ　せいしつ。" />);
    });

    then("PokemonDetailにフレーバーテキストが表示される", () => {
      expect(screen.getByText("でんきを　ためこむ　せいしつ。")).toBeTruthy();
    });
  });

  test("フレーバーテキストが未指定の場合は表示されない", ({ given, when, then }) => {
    given("ピカチュウのデータが用意されている", () => {
      // mockPokemonForDetail is predefined
    });

    when("PokemonDetailをレンダリングする", () => {
      render(<PokemonDetail pokemon={mockPokemonForDetail} />);
    });

    then("フレーバーテキストのローディングが表示されない", () => {
      expect(screen.queryByTestId("flavor-text-loading")).toBeNull();
    });
  });

  // ============================================================
  // PokemonAbilitiesコンポーネント
  // ============================================================

  test("とくせいセクションタイトルが表示される", ({ given, when, then }) => {
    given("とくせいリストが与えられている", () => {
      // mockAbilities is predefined
    });

    when("PokemonAbilitiesをレンダリングする", () => {
      render(<PokemonAbilities abilities={mockAbilities} />);
    });

    then(/^とくせいセクションタイトル「(.*)」が表示される$/, (title: string) => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  test("とくせい名がキャピタライズされて表示される", ({ given, when, then }) => {
    given("とくせいリストが与えられている", () => {
      // mockAbilities is predefined
    });

    when("PokemonAbilitiesをレンダリングする", () => {
      render(<PokemonAbilities abilities={mockAbilities} />);
    });

    then(/^とくせい名「(.*)」が表示される$/, (name: string) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  test("隠れとくせいにラベルが付与される", ({ given, when, then }) => {
    given("とくせいリストが与えられている", () => {
      // mockAbilities is predefined
    });

    when("PokemonAbilitiesをレンダリングする", () => {
      render(<PokemonAbilities abilities={mockAbilities} />);
    });

    then(/^隠れとくせい「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("複数のとくせいが全て表示される", ({ given, when, then, and }) => {
    given("とくせいリストが与えられている", () => {
      // mockAbilities is predefined
    });

    when("PokemonAbilitiesをレンダリングする", () => {
      render(<PokemonAbilities abilities={mockAbilities} />);
    });

    then(/^とくせい名「(.*)」が表示される$/, (name: string) => {
      expect(screen.getByText(name)).toBeTruthy();
    });

    and(/^隠れとくせい「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  // ============================================================
  // PokemonFlavorTextコンポーネント
  // ============================================================

  let flavorTextValue: string | null;
  let flavorTextIsLoading: boolean;
  let flavorTextRenderResult: ReturnType<typeof render> | null;

  test("フレーバーテキストコンポーネントにテキストが表示される", ({ given, when, then }) => {
    given("フレーバーテキストが与えられている", () => {
      flavorTextValue = "でんきを　ためこむ　せいしつ。";
      flavorTextIsLoading = false;
    });

    when("PokemonFlavorTextをレンダリングする", () => {
      render(<PokemonFlavorText text={flavorTextValue} />);
    });

    then(/^テキスト「(.*)」が表示される$/, (expected: string) => {
      expect(screen.getByText(expected)).toBeTruthy();
    });
  });

  test("ローディング中にフレーバーテキストのインジケータが表示される", ({ given, when, then }) => {
    given("テキストがnullでローディング中である", () => {
      flavorTextValue = null;
      flavorTextIsLoading = true;
    });

    when("PokemonFlavorTextをレンダリングする", () => {
      render(<PokemonFlavorText text={flavorTextValue} isLoading={flavorTextIsLoading} />);
    });

    then("フレーバーテキストのローディングインジケータが表示される", () => {
      expect(screen.getByTestId("flavor-text-loading")).toBeTruthy();
    });
  });

  test("テキストがnullでローディングでない場合は何も表示されない", ({ given, when, then }) => {
    given("テキストがnullでローディングでない", () => {
      flavorTextValue = null;
      flavorTextIsLoading = false;
    });

    when("PokemonFlavorTextをレンダリングする", () => {
      flavorTextRenderResult = render(<PokemonFlavorText text={flavorTextValue} isLoading={flavorTextIsLoading} />);
    });

    then("何も表示されない", () => {
      expect(flavorTextRenderResult!.toJSON()).toBeNull();
    });
  });

  // ============================================================
  // PokemonPhysicalInfoコンポーネント
  // ============================================================

  let physicalHeight: number;
  let physicalWeight: number;

  test("身長の値が表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      physicalHeight = Number(h);
      physicalWeight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={physicalHeight} weight={physicalWeight} />);
    });

    then(/^体格情報「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("体重の値が表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      physicalHeight = Number(h);
      physicalWeight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={physicalHeight} weight={physicalWeight} />);
    });

    then(/^体格情報「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("身長ラベルが表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      physicalHeight = Number(h);
      physicalWeight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={physicalHeight} weight={physicalWeight} />);
    });

    then(/^体格情報「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("体重ラベルが表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      physicalHeight = Number(h);
      physicalWeight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={physicalHeight} weight={physicalWeight} />);
    });

    then(/^体格情報「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("整数の身長が正しくフォーマットされる", ({ given, when, then, and }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      physicalHeight = Number(h);
      physicalWeight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={physicalHeight} weight={physicalWeight} />);
    });

    then(/^体格情報「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^体格情報「(.*)」も表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  // ============================================================
  // PokemonStatsコンポーネント
  // ============================================================

  test("ステータスセクションタイトルが表示される", ({ given, when, then }) => {
    given("ステータスデータが与えられている", () => {
      // mockStats is predefined
    });

    when("PokemonStatsをレンダリングする", () => {
      render(<PokemonStats stats={mockStats} />);
    });

    then(/^ステータス「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("6つのステータスバーが表示される", ({ given, when, then, and }) => {
    given("ステータスデータが与えられている", () => {
      // mockStats is predefined
    });

    when("PokemonStatsをレンダリングする", () => {
      render(<PokemonStats stats={mockStats} />);
    });

    then(/^ステータス「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^ステータス「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^ステータス「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^ステータス「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^ステータス「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^ステータス「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("各ステータスの値が正しく表示される", ({ given, when, then, and }) => {
    given("ステータスデータが与えられている", () => {
      // mockStats is predefined
    });

    when("PokemonStatsをレンダリングする", () => {
      render(<PokemonStats stats={mockStats} />);
    });

    then(/^値「(\d+)」が(\d+)つ表示される$/, (value: string, count: string) => {
      expect(screen.getAllByText(value)).toHaveLength(Number(count));
    });

    and(/^値「(\d+)」が(\d+)つ表示される$/, (value: string, count: string) => {
      expect(screen.getAllByText(value)).toHaveLength(Number(count));
    });

    and(/^値「(\d+)」が(\d+)つ表示される$/, (value: string, count: string) => {
      expect(screen.getAllByText(value)).toHaveLength(Number(count));
    });
  });

  // ============================================================
  // StatBarコンポーネント
  // ============================================================

  let statBarLabel: string;
  let statBarValue: number;
  let statBarMaxValue: number | undefined;

  test("StatBarにステータス名が表示される", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)のStatBarが与えられている$/, (l: string, v: string) => {
      statBarLabel = l;
      statBarValue = Number(v);
      statBarMaxValue = undefined;
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={statBarLabel} value={statBarValue} />);
    });

    then(/^StatBarに「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("StatBarにステータス値が表示される", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)のStatBarが与えられている$/, (l: string, v: string) => {
      statBarLabel = l;
      statBarValue = Number(v);
      statBarMaxValue = undefined;
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={statBarLabel} value={statBarValue} />);
    });

    then(/^StatBarに「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("バーの幅がステータス値に比例する", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)、最大値(\d+)のStatBarが与えられている$/, (l: string, v: string, m: string) => {
      statBarLabel = l;
      statBarValue = Number(v);
      statBarMaxValue = Number(m);
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={statBarLabel} value={statBarValue} maxValue={statBarMaxValue} />);
    });

    then(/^バーの幅が「(.*)」である$/, (width: string) => {
      const bar = screen.getByTestId("stat-bar-fill");
      expect(bar.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width }),
        ])
      );
    });
  });

  test("maxValueのデフォルトは180", ({ given, when, then }) => {
    given(/^ラベル「(.*)」、値(\d+)のStatBarが与えられている$/, (l: string, v: string) => {
      statBarLabel = l;
      statBarValue = Number(v);
      statBarMaxValue = undefined;
    });

    when("StatBarをレンダリングする", () => {
      render(<StatBar label={statBarLabel} value={statBarValue} />);
    });

    then(/^バーの幅が「(.*)」である$/, (width: string) => {
      const bar = screen.getByTestId("stat-bar-fill");
      expect(bar.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width }),
        ])
      );
    });
  });

  // ============================================================
  // FavoriteButtonコンポーネント（shared）
  // ============================================================

  let favoriteOnToggle: jest.Mock;
  let favoriteRerender: ReturnType<typeof render>["rerender"];

  test("Lottieアニメーションコンポーネントが描画される", ({ given, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={favoriteOnToggle} />);
    });

    then("Lottieアニメーションコンポーネントが存在する", () => {
      expect(screen.getByTestId("favorite-lottie")).toBeTruthy();
    });
  });

  test("autoPlayが無効になっている", ({ given, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={favoriteOnToggle} />);
    });

    then("autoPlayがfalseである", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.autoPlay).toBe(false);
    });
  });

  test("ループが無効になっている", ({ given, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={favoriteOnToggle} />);
    });

    then("loopがfalseである", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.loop).toBe(false);
    });
  });

  test("ボタン押下時にonToggleが即座に呼ばれる", ({ given, when, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={favoriteOnToggle} />);
    });

    when("お気に入りボタンを押す", () => {
      fireEvent.press(screen.getByTestId("favorite-button"));
    });

    then("onToggleが1回呼ばれる", () => {
      expect(favoriteOnToggle).toHaveBeenCalledTimes(1);
    });
  });

  test("お気に入り状態の場合、ONの最終フレームで初期表示される", ({ given, then }) => {
    given("お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={true} onToggle={favoriteOnToggle} />);
    });

    then("progressがON最終フレームの値である", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.progress).toBeCloseTo(90 / 181);
    });
  });

  test("非お気に入り状態の場合、progressが0で初期表示される", ({ given, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={favoriteOnToggle} />);
    });

    then("progressが0である", () => {
      const lottie = screen.getByTestId("favorite-lottie");
      expect(lottie.props.progress).toBe(0);
    });
  });

  test("外部からisFavoriteが変更された場合、progressが再同期される", ({ given, then, when }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      const result = render(
        <FavoriteButton isFavorite={false} onToggle={favoriteOnToggle} />
      );
      favoriteRerender = result.rerender;
    });

    then("progressが0である", () => {
      expect(screen.getByTestId("favorite-lottie").props.progress).toBe(0);
    });

    when("isFavoriteをtrueに変更する", () => {
      favoriteRerender(<FavoriteButton isFavorite={true} onToggle={favoriteOnToggle} />);
    });

    then("progressがON最終フレームの値である", () => {
      expect(
        screen.getByTestId("favorite-lottie").props.progress
      ).toBeCloseTo(90 / 181);
    });
  });

  test("お気に入り状態のアクセシビリティラベルが正しい", ({ given, then }) => {
    given("お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={true} onToggle={favoriteOnToggle} />);
    });

    then(
      /^アクセシビリティラベルが "(.*)" である$/,
      (label: string) => {
        expect(screen.getByLabelText(label)).toBeTruthy();
      }
    );
  });

  test("非お気に入り状態のアクセシビリティラベルが正しい", ({ given, then }) => {
    given("非お気に入り状態のFavoriteButtonを描画する", () => {
      favoriteOnToggle = jest.fn();
      render(<FavoriteButton isFavorite={false} onToggle={favoriteOnToggle} />);
    });

    then(
      /^アクセシビリティラベルが "(.*)" である$/,
      (label: string) => {
        expect(screen.getByLabelText(label)).toBeTruthy();
      }
    );
  });
});
