import {
  extractPokemonId,
  capitalizeName,
  toPokemon,
} from "@/src/modules/home/domain/pokemonListItem";

describe("extractPokemonId", () => {
  it("URLからポケモンIDを数値として抽出する", () => {
    expect(
      extractPokemonId("https://pokeapi.co/api/v2/pokemon/25/")
    ).toBe(25);
  });

  it("別のIDでも正しく抽出する", () => {
    expect(
      extractPokemonId("https://pokeapi.co/api/v2/pokemon/151/")
    ).toBe(151);
  });

  it("末尾スラッシュなしのURLでも正しく抽出する", () => {
    expect(
      extractPokemonId("https://pokeapi.co/api/v2/pokemon/1")
    ).toBe(1);
  });
});

describe("capitalizeName", () => {
  it("小文字の名前を先頭大文字化する", () => {
    expect(capitalizeName("bulbasaur")).toBe("Bulbasaur");
  });

  it("空文字列を処理できる", () => {
    expect(capitalizeName("")).toBe("");
  });
});

describe("toPokemon", () => {
  it("PokeApiListItemをPokemon型に変換する", () => {
    const result = toPokemon({
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
    });

    expect(result).toEqual({
      id: 25,
      name: "Pikachu",
      types: [],
    });
  });

  it("typesは空配列になる", () => {
    const result = toPokemon({
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/",
    });

    expect(result.types).toEqual([]);
  });
});
