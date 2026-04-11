import { typeColors } from "@/src/constants/typeColors";
import type { PokemonType } from "@/src/types/pokemon";

const allTypes: PokemonType[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

describe("typeColors", () => {
  it("全18タイプの色が定義されている", () => {
    for (const type of allTypes) {
      expect(typeColors[type]).toBeDefined();
    }
    expect(Object.keys(typeColors)).toHaveLength(18);
  });

  it("各色が有効なHEXカラーコードである", () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    for (const color of Object.values(typeColors)) {
      expect(color).toMatch(hexPattern);
    }
  });
});
