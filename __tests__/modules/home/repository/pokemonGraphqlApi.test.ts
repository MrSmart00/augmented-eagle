import {
  fetchPokemonListGraphQL,
} from "@/src/modules/home/repository/pokemonGraphqlApi";

const mockGraphQLResponse = {
  data: {
    pokemon_v2_pokemon: [
      {
        id: 1,
        pokemon_v2_pokemonspecy: {
          name: "bulbasaur",
          pokemon_v2_pokemonspeciesnames: [{ name: "フシギダネ" }],
        },
        pokemon_v2_pokemontypes: [
          { pokemon_v2_type: { name: "grass" } },
          { pokemon_v2_type: { name: "poison" } },
        ],
      },
      {
        id: 4,
        pokemon_v2_pokemonspecy: {
          name: "charmander",
          pokemon_v2_pokemonspeciesnames: [{ name: "ヒトカゲ" }],
        },
        pokemon_v2_pokemontypes: [
          { pokemon_v2_type: { name: "fire" } },
        ],
      },
    ],
    pokemon_v2_pokemon_aggregate: {
      aggregate: { count: 1025 },
    },
  },
};

const mockEmptyNameResponse = {
  data: {
    pokemon_v2_pokemon: [
      {
        id: 1,
        pokemon_v2_pokemonspecy: {
          name: "bulbasaur",
          pokemon_v2_pokemonspeciesnames: [],
        },
        pokemon_v2_pokemontypes: [
          { pokemon_v2_type: { name: "grass" } },
        ],
      },
    ],
    pokemon_v2_pokemon_aggregate: {
      aggregate: { count: 1 },
    },
  },
};

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchPokemonListGraphQL", () => {
  it("GraphQLエンドポイントにPOSTリクエストを送信する", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGraphQLResponse),
    });

    await fetchPokemonListGraphQL(20, 0, "ja");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://beta.pokeapi.co/graphql/v1beta",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("ローカライズされたポケモン名とタイプを返す", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGraphQLResponse),
    });

    const result = await fetchPokemonListGraphQL(20, 0, "ja");

    expect(result.count).toBe(1025);
    expect(result.pokemon).toHaveLength(2);
    expect(result.pokemon[0]).toEqual({
      id: 1,
      name: "フシギダネ",
      types: ["grass", "poison"],
    });
    expect(result.pokemon[1]).toEqual({
      id: 4,
      name: "ヒトカゲ",
      types: ["fire"],
    });
  });

  it("ローカライズ名がない場合はspecies名にフォールバックする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmptyNameResponse),
    });

    const result = await fetchPokemonListGraphQL(20, 0, "ja");

    expect(result.pokemon[0].name).toBe("Bulbasaur");
  });

  it("HTTPエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchPokemonListGraphQL(20, 0, "ja")).rejects.toThrow(
      "GraphQL request failed: 500",
    );
  });

  it("GraphQLエラー時にエラーをスローする", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          errors: [{ message: "Field not found" }],
        }),
    });

    await expect(fetchPokemonListGraphQL(20, 0, "ja")).rejects.toThrow(
      "GraphQL error: Field not found",
    );
  });
});
