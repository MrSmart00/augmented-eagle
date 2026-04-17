import { defineFeature, loadFeature } from "jest-cucumber";
import { typeColors } from "@/src/shared";
import type { PokemonType } from "@/src/shared";

const feature = loadFeature(
  "__tests__/shared/features/typeColors.feature"
);

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

defineFeature(feature, (test) => {
  test("全18タイプの色が定義されている", ({ given, when, then, and }) => {
    given("typeColorsが定義されている", () => {
      expect(typeColors).toBeDefined();
    });

    when("全18タイプのキーを確認する", () => {
      // verification happens in then
    });

    then("全てのタイプに色が定義されている", () => {
      for (const type of allTypes) {
        expect(typeColors[type]).toBeDefined();
      }
    });

    and("キーの数が18である", () => {
      expect(Object.keys(typeColors)).toHaveLength(18);
    });
  });

  test("各色が有効なHEXカラーコードである", ({ given, when, then }) => {
    given("typeColorsが定義されている", () => {
      expect(typeColors).toBeDefined();
    });

    when("全ての色の値を確認する", () => {
      // verification happens in then
    });

    then("全てHEXカラーコード形式である", () => {
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;
      for (const color of Object.values(typeColors)) {
        expect(color).toMatch(hexPattern);
      }
    });
  });
});
