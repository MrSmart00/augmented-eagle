import { render, screen } from "@testing-library/react-native";
import { PokemonStats } from "@/src/detail/components/PokemonStats";
import type { PokemonStat } from "@/src/shared";

const mockStats: PokemonStat[] = [
  { name: "hp", baseStat: 45 },
  { name: "attack", baseStat: 49 },
  { name: "defense", baseStat: 49 },
  { name: "special-attack", baseStat: 65 },
  { name: "special-defense", baseStat: 65 },
  { name: "speed", baseStat: 45 },
];

describe("PokemonStats", () => {
  it("セクションタイトルが表示される", () => {
    render(<PokemonStats stats={mockStats} />);
    expect(screen.getByText("detail.baseStats")).toBeTruthy();
  });

  it("6つのステータスバーが表示される", () => {
    render(<PokemonStats stats={mockStats} />);
    expect(screen.getByText("detail.stats.hp")).toBeTruthy();
    expect(screen.getByText("detail.stats.attack")).toBeTruthy();
    expect(screen.getByText("detail.stats.defense")).toBeTruthy();
    expect(screen.getByText("detail.stats.special-attack")).toBeTruthy();
    expect(screen.getByText("detail.stats.special-defense")).toBeTruthy();
    expect(screen.getByText("detail.stats.speed")).toBeTruthy();
  });

  it("各ステータスの値が正しく表示される", () => {
    render(<PokemonStats stats={mockStats} />);
    expect(screen.getAllByText("45")).toHaveLength(2);
    expect(screen.getAllByText("49")).toHaveLength(2);
    expect(screen.getAllByText("65")).toHaveLength(2);
  });
});
