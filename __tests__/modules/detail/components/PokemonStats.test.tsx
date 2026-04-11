import { render, screen } from "@testing-library/react-native";
import { PokemonStats } from "@/src/modules/detail/components/PokemonStats";
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
    expect(screen.getByText("Base Stats")).toBeTruthy();
  });

  it("6つのステータスバーが表示される", () => {
    render(<PokemonStats stats={mockStats} />);
    expect(screen.getByText("HP")).toBeTruthy();
    expect(screen.getByText("Attack")).toBeTruthy();
    expect(screen.getByText("Defense")).toBeTruthy();
    expect(screen.getByText("Sp.Atk")).toBeTruthy();
    expect(screen.getByText("Sp.Def")).toBeTruthy();
    expect(screen.getByText("Speed")).toBeTruthy();
  });

  it("各ステータスの値が正しく表示される", () => {
    render(<PokemonStats stats={mockStats} />);
    expect(screen.getAllByText("45")).toHaveLength(2);
    expect(screen.getAllByText("49")).toHaveLength(2);
    expect(screen.getAllByText("65")).toHaveLength(2);
  });
});
