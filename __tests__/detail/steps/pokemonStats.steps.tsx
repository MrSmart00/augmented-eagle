import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react-native";
import { PokemonStats } from "@/src/detail/components/PokemonStats";
import type { PokemonStat } from "@/src/shared";

const feature = loadFeature(
  "__tests__/detail/features/pokemonStats.feature"
);

const mockStats: PokemonStat[] = [
  { name: "hp", baseStat: 45 },
  { name: "attack", baseStat: 49 },
  { name: "defense", baseStat: 49 },
  { name: "special-attack", baseStat: 65 },
  { name: "special-defense", baseStat: 65 },
  { name: "speed", baseStat: 45 },
];

defineFeature(feature, (test) => {
  test("セクションタイトルが表示される", ({ given, when, then }) => {
    given("ステータスデータが与えられている", () => {
      // mockStats is predefined
    });

    when("PokemonStatsをレンダリングする", () => {
      render(<PokemonStats stats={mockStats} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
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

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
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
});
