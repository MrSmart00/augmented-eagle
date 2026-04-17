import { defineFeature, loadFeature } from "jest-cucumber";
import {
  extractPokemonId,
  capitalizeName,
  toPokemon,
} from "@/src/home";
import type { PokemonSummary } from "@/src/shared";

const feature = loadFeature(
  "__tests__/home/features/pokemonListItem.feature"
);

defineFeature(feature, (test) => {
  let url: string;
  let name: string;
  let extractedId: number;
  let capitalizedName: string;
  let pokemon: PokemonSummary;

  test("URLからポケモンIDを抽出する", ({ given, when, then }) => {
    given(/^PokeAPIのURL "(.*)" が与えられている$/, (givenUrl: string) => {
      url = givenUrl;
    });

    when("URLからIDを抽出する", () => {
      extractedId = extractPokemonId(url);
    });

    then(/^IDは (\d+) である$/, (expectedId: string) => {
      expect(extractedId).toBe(Number(expectedId));
    });
  });

  test("ポケモン名を先頭大文字化する", ({ given, when, then }) => {
    given(/^ポケモン名 "(.*)" が与えられている$/, (givenName: string) => {
      name = givenName;
    });

    when("名前を先頭大文字化する", () => {
      capitalizedName = capitalizeName(name);
    });

    then(/^結果は "(.*)" である$/, (expected: string) => {
      expect(capitalizedName).toBe(expected);
    });
  });

  test("PokeApiListItemをPokemonSummary型に変換する", ({
    given,
    when,
    then,
    and,
  }) => {
    given(
      /^PokeAPIリストアイテムの名前が "(.*)" でURLが "(.*)" である$/,
      (givenName: string, givenUrl: string) => {
        name = givenName;
        url = givenUrl;
      }
    );

    when("PokemonSummary型に変換する", () => {
      pokemon = toPokemon({ name, url });
    });

    then(/^IDは (\d+) である$/, (expectedId: string) => {
      expect(pokemon.id).toBe(Number(expectedId));
    });

    and(/^名前は "(.*)" である$/, (expectedName: string) => {
      expect(pokemon.name).toBe(expectedName);
    });

    and("typesは空配列である", () => {
      expect(pokemon.types).toEqual([]);
    });
  });
});
