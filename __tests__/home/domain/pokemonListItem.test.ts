import { extractPokemonId, capitalizeName, toPokemon } from "@/src/home";

describe("extractPokemonId", () => {
  it("URLからポケモンIDを数値として抽出する", () => {
    expect(extractPokemonId("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });

  it("末尾スラッシュなしのURLからもIDを抽出する", () => {
    expect(extractPokemonId("https://pokeapi.co/api/v2/pokemon/1")).toBe(1);
  });

  it("3桁のIDも正しく抽出する", () => {
    expect(extractPokemonId("https://pokeapi.co/api/v2/pokemon/151/")).toBe(151);
  });
});

describe("capitalizeName", () => {
  it("先頭文字を大文字にする", () => {
    expect(capitalizeName("bulbasaur")).toBe("Bulbasaur");
  });

  it("空文字の場合はそのまま返す", () => {
    expect(capitalizeName("")).toBe("");
  });
});

describe("toPokemon", () => {
  it("PokeApiListItemをPokemonSummary型に変換する", () => {
    const result = toPokemon({
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
    });

    expect(result.id).toBe(25);
    expect(result.name).toBe("Pikachu");
    expect(result.types).toEqual([]);
  });
});
