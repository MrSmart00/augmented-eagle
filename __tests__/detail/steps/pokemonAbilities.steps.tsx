import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react-native";
import { PokemonAbilities } from "@/src/detail/components/PokemonAbilities";
import type { PokemonAbility } from "@/src/shared";

const feature = loadFeature(
  "__tests__/detail/features/pokemonAbilities.feature"
);

const mockAbilities: PokemonAbility[] = [
  { name: "overgrow", isHidden: false },
  { name: "chlorophyll", isHidden: true },
];

defineFeature(feature, (test) => {
  test("セクションタイトルが表示される", ({ given, when, then }) => {
    given("とくせいリストが与えられている", () => {
      // mockAbilities is predefined
    });

    when("PokemonAbilitiesをレンダリングする", () => {
      render(<PokemonAbilities abilities={mockAbilities} />);
    });

    then(/^セクションタイトル「(.*)」が表示される$/, (title: string) => {
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
});
