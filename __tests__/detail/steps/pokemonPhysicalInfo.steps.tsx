import { defineFeature, loadFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react-native";
import { PokemonPhysicalInfo } from "@/src/detail/components/PokemonPhysicalInfo";

const feature = loadFeature(
  "__tests__/detail/features/pokemonPhysicalInfo.feature"
);

defineFeature(feature, (test) => {
  let height: number;
  let weight: number;

  test("身長の値が表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      height = Number(h);
      weight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={height} weight={weight} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("体重の値が表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      height = Number(h);
      weight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={height} weight={weight} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("身長ラベルが表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      height = Number(h);
      weight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={height} weight={weight} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("体重ラベルが表示される", ({ given, when, then }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      height = Number(h);
      weight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={height} weight={weight} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });

  test("整数の身長が正しくフォーマットされる", ({ given, when, then, and }) => {
    given(/^身長(\d+)、体重(\d+)のポケモンデータが与えられている$/, (h: string, w: string) => {
      height = Number(h);
      weight = Number(w);
    });

    when("PokemonPhysicalInfoをレンダリングする", () => {
      render(<PokemonPhysicalInfo height={height} weight={weight} />);
    });

    then(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });

    and(/^「(.*)」が表示される$/, (text: string) => {
      expect(screen.getByText(text)).toBeTruthy();
    });
  });
});
